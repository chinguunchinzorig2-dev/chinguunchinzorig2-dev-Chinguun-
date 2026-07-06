import express from "express";
import path from "path";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { getRandomQuote, Quote } from "./src/data/quotes.js";

// Types
interface Player {
  id: string;
  name: string;
  avatar: string; // Emoji representing horse/car/rocket
  progress: number; // 0 to 100
  wpm: number;
  errors: number;
  finished: boolean;
  isHost: boolean;
}

interface Room {
  code: string;
  players: Player[];
  state: "waiting" | "countdown" | "racing" | "finished";
  countdown: number;
  quote: { text: string; author: string };
  language: "mn" | "en" | "all";
  difficulty: "easy" | "medium" | "hard";
  createdAt: number;
}

interface ScoreRecord {
  id: string;
  name: string;
  wpm: number;
  errors: number;
  accuracy: number;
  quoteText: string;
  timestamp: string;
}

const PORT = 3000;
const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ noServer: true });

app.use(express.json());

// In-Memory state
const rooms = new Map<string, Room>();
const clientRooms = new Map<string, string>(); // Client ID -> Room Code
const clientSockets = new Map<string, WebSocket>(); // Client ID -> Socket

const SCORES_FILE = path.join(process.cwd(), "scores.json");
let leaderboard: ScoreRecord[] = [];

// Load leaderboards
try {
  if (fs.existsSync(SCORES_FILE)) {
    const raw = fs.readFileSync(SCORES_FILE, "utf-8");
    leaderboard = JSON.parse(raw);
  } else {
    // Seed default records as empty
    leaderboard = [];
    fs.writeFileSync(SCORES_FILE, JSON.stringify(leaderboard, null, 2), "utf-8");
  }
} catch (e) {
  console.error("Error loading scores:", e);
}

function saveScores() {
  try {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(leaderboard, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving scores:", e);
  }
}

// Lazy-initialized Gemini Client
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return ai;
}

// REST endpoints
app.get("/api/leaderboard", (req, res) => {
  res.json(leaderboard.slice(0, 10));
});

app.post("/api/leaderboard", (req, res) => {
  const { name, wpm, errors, accuracy, quoteText } = req.body;
  if (!name || typeof wpm !== "number") {
    return res.status(400).json({ error: "Invalid score data" });
  }

  // Allow any participating player who has typed a name to save their score
  const cleanName = (name || "").trim();
  if (cleanName === "") {
    return res.status(400).json({ 
      error: "Тэргүүлэгчдийн жагсаалтад орохын тулд нэрээ оруулна уу!" 
    });
  }

  const record: ScoreRecord = {
    id: Math.random().toString(36).substring(2, 9),
    name: cleanName,
    wpm,
    errors: errors || 0,
    accuracy: typeof accuracy === "number" ? accuracy : 100,
    quoteText: quoteText || "",
    timestamp: new Date().toISOString(),
  };

  leaderboard.push(record);
  leaderboard.sort((a, b) => b.wpm - a.wpm); // Sort by WPM descending
  leaderboard = leaderboard.slice(0, 20); // Keep top 20, serve top 10

  saveScores();
  res.json({ success: true, leaderboard: leaderboard.slice(0, 10) });
});

// REST API for AI Quote generation
app.post("/api/gemini/generate-quote", async (req, res) => {
  const { language } = req.body;
  const client = getGeminiClient();
  if (!client) {
    return res.status(400).json({ error: "Gemini API key is not configured. Check Secrets." });
  }

  try {
    const prompt = language === "mn"
      ? `Generate a single short, inspirational, beautiful or chill quote in MONGOLIAN for a typing game speed test. 
         Keep it between 10 and 18 words. Avoid punctuation symbols like long colons or weird brackets. Do not include any translation, quote marks, markdown, or explanation. Write only the plain Mongolian quote itself.`
      : `Generate a single short, beautiful, or chill quote in ENGLISH for a typing speed game. 
         Keep it between 10 and 18 words. Do not include quote marks, markdown, or extra explanations. Return only the plain English text.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.85,
      }
    });

    const quoteText = response.text ? response.text.trim().replace(/^["']|["']$/g, "") : "";
    if (!quoteText) {
      throw new Error("Empty response from Gemini");
    }

    res.json({ text: quoteText, author: "Gemini AI" });
  } catch (err: any) {
    console.error("Gemini quote generation failed:", err);
    res.status(500).json({ error: err.message || "Failed to generate quote" });
  }
});

// Helper: Alphanumeric room code generator
function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Avoid ambiguous O, 0, I, 1
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Broadcaster to Room
function broadcastToRoom(roomCode: string, data: any) {
  const room = rooms.get(roomCode);
  if (!room) return;

  const payload = JSON.stringify(data);
  room.players.forEach((player) => {
    const ws = clientSockets.get(player.id);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(payload);
    }
  });
}

// Websocket connection handling
wss.on("connection", (ws: WebSocket) => {
  const clientId = Math.random().toString(36).substring(2, 11);
  clientSockets.set(clientId, ws);

  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message);
      const { type } = data;

      switch (type) {
        case "create-room": {
          const { name, avatar, language, difficulty } = data;
          const roomCode = generateRoomCode();
          
          // Select quote
          const qObj = getRandomQuote(language === "all" ? undefined : language, difficulty);
          
          const newRoom: Room = {
            code: roomCode,
            players: [
              {
                id: clientId,
                name: name || "Anonymous",
                avatar: avatar || "🚗",
                progress: 0,
                wpm: 0,
                errors: 0,
                finished: false,
                isHost: true,
              }
            ],
            state: "waiting",
            countdown: 5,
            quote: { text: qObj.text, author: qObj.author },
            language: language || "all",
            difficulty: difficulty || "medium",
            createdAt: Date.now(),
          };

          rooms.set(roomCode, newRoom);
          clientRooms.set(clientId, roomCode);

          ws.send(JSON.stringify({ type: "room-created", room: newRoom, clientId }));
          break;
        }

        case "join-room": {
          const { code, name, avatar } = data;
          const cleanCode = (code || "").toUpperCase().trim();
          const room = rooms.get(cleanCode);

          if (!room) {
            ws.send(JSON.stringify({ type: "error", message: "Room not found. Check the code." }));
            break;
          }

          if (room.state !== "waiting") {
            ws.send(JSON.stringify({ type: "error", message: "Race has already started in this room." }));
            break;
          }

          // Limit room size to 8 players for chill vibes
          if (room.players.length >= 8) {
            ws.send(JSON.stringify({ type: "error", message: "Room is full (max 8 players)." }));
            break;
          }

          const newPlayer: Player = {
            id: clientId,
            name: name || "Anonymous Player",
            avatar: avatar || "🐎",
            progress: 0,
            wpm: 0,
            errors: 0,
            finished: false,
            isHost: false,
          };

          room.players.push(newPlayer);
          clientRooms.set(clientId, cleanCode);

          ws.send(JSON.stringify({ type: "room-joined", room, clientId }));
          broadcastToRoom(cleanCode, { type: "room-updated", room });
          break;
        }

        case "start-countdown": {
          const roomCode = clientRooms.get(clientId);
          if (!roomCode) break;
          const room = rooms.get(roomCode);
          if (!room) break;

          // Only host can start
          const player = room.players.find(p => p.id === clientId);
          if (!player || !player.isHost) break;

          room.state = "countdown";
          room.countdown = 5;
          room.players.forEach(p => {
            p.progress = 0;
            p.wpm = 0;
            p.errors = 0;
            p.finished = false;
          });

          broadcastToRoom(roomCode, { type: "room-updated", room });

          // Start the server countdown
          const intervalId = setInterval(() => {
            const r = rooms.get(roomCode);
            if (!r || r.state !== "countdown") {
              clearInterval(intervalId);
              return;
            }

            r.countdown -= 1;
            if (r.countdown <= 0) {
              r.state = "racing";
              broadcastToRoom(roomCode, { type: "room-updated", room: r });
              clearInterval(intervalId);
            } else {
              broadcastToRoom(roomCode, { type: "room-updated", room: r });
            }
          }, 1000);
          break;
        }

        case "update-progress": {
          const roomCode = clientRooms.get(clientId);
          if (!roomCode) break;
          const room = rooms.get(roomCode);
          if (!room) break;

          const player = room.players.find(p => p.id === clientId);
          if (!player) break;

          player.progress = data.progress;
          player.wpm = data.wpm;
          player.errors = data.errors;
          player.finished = data.finished;

          // Check if all players have finished
          const allFinished = room.players.every((p) => p.finished);
          if (allFinished && room.state === "racing") {
            room.state = "finished";
          }

          broadcastToRoom(roomCode, { type: "room-updated", room });
          break;
        }

        case "restart-game": {
          const roomCode = clientRooms.get(clientId);
          if (!roomCode) break;
          const room = rooms.get(roomCode);
          if (!room) break;

          const player = room.players.find(p => p.id === clientId);
          if (!player || !player.isHost) break;

          // Reset quote and room state
          const qObj = getRandomQuote(room.language === "all" ? undefined : room.language, room.difficulty);
          room.quote = { text: qObj.text, author: qObj.author };
          room.state = "waiting";
          room.players.forEach((p) => {
            p.progress = 0;
            p.wpm = 0;
            p.errors = 0;
            p.finished = false;
          });

          broadcastToRoom(roomCode, { type: "room-updated", room });
          break;
        }

        case "change-quote": {
          const roomCode = clientRooms.get(clientId);
          if (!roomCode) break;
          const room = rooms.get(roomCode);
          if (!room) break;

          const player = room.players.find(p => p.id === clientId);
          if (!player || !player.isHost) break;

          // If standard quote or custom quote passed
          if (data.quote) {
            room.quote = data.quote;
          } else {
            const qObj = getRandomQuote(room.language === "all" ? undefined : room.language, room.difficulty);
            room.quote = { text: qObj.text, author: qObj.author };
          }
          broadcastToRoom(roomCode, { type: "room-updated", room });
          break;
        }

        case "leave-room": {
          handlePlayerLeave(clientId);
          break;
        }

        case "request-leaderboard": {
          ws.send(JSON.stringify({ type: "leaderboard", leaderboard: leaderboard.slice(0, 10) }));
          break;
        }
      }
    } catch (err) {
      console.error("WS Message Error:", err);
    }
  });

  ws.on("close", () => {
    handlePlayerLeave(clientId);
    clientSockets.delete(clientId);
  });
});

function handlePlayerLeave(cid: string) {
  const roomCode = clientRooms.get(cid);
  if (!roomCode) return;

  clientRooms.delete(cid);
  const room = rooms.get(roomCode);
  if (!room) return;

  const leavingPlayerIndex = room.players.findIndex(p => p.id === cid);
  if (leavingPlayerIndex === -1) return;

  const leavingPlayer = room.players[leavingPlayerIndex];
  room.players.splice(leavingPlayerIndex, 1);

  if (room.players.length === 0) {
    // Destroy room if empty
    rooms.delete(roomCode);
  } else {
    // If host left, assign a new host
    if (leavingPlayer.isHost) {
      room.players[0].isHost = true;
    }
    
    // Check if remaining players are all finished
    if (room.state === "racing" && room.players.every((p) => p.finished)) {
      room.state = "finished";
    }

    broadcastToRoom(roomCode, { type: "room-updated", room });
  }
}

// Attach websocket server to http upgrade
httpServer.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url || "", `http://${request.headers.host}`).pathname;

  if (pathname === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Start server
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();
