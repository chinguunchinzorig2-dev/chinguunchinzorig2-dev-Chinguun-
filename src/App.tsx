import React, { useState, useEffect, useRef } from "react";
import { Room, Player } from "./types";
import { getRandomQuote } from "./data/quotes";
import Lobby from "./components/Lobby";
import GameTrack from "./components/GameTrack";
import GameArea from "./components/GameArea";
import Leaderboard from "./components/Leaderboard";
import { Trophy, Keyboard, Users, Radio, Info, Heart, Volume2, VolumeX, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Web Audio API Retro-Chill Synthesizer Sounds
const playBeep = (type: "tick" | "start" | "success" | "error", soundOn: boolean) => {
  if (!soundOn) return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "tick") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === "start") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.24); // C6
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } else if (type === "error") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch (e) {
    // Ignore context locks
  }
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<"lobby" | "leaderboard">("lobby");
  const [soundOn, setSoundOn] = useState(true);

  // Player configurations from localStorage
  const [name, setName] = useState(() => {
    return localStorage.getItem("typeracer_name") || `Уралдагч-${Math.floor(Math.random() * 900 + 100)}`;
  });
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("typeracer_avatar") || "🚗";
  });

  // Room states (null for local/practice mode)
  const [room, setRoom] = useState<Room | null>(null);
  const [clientId, setClientId] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const [highlightId, setHighlightId] = useState("");

  // Single player states (fallback practice)
  const [localQuote, setLocalQuote] = useState(() => getRandomQuote("mn"));
  const [soloLanguage, setSoloLanguage] = useState<"mn" | "en">("mn");
  const [soloDifficulty, setSoloDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [singleState, setSingleState] = useState<"waiting" | "countdown" | "racing" | "finished">("waiting");
  const [singleCountdown, setSingleCountdown] = useState(5);
  const [singlePlayer, setSinglePlayer] = useState<Player>({
    id: "local-user",
    name: name,
    avatar: avatar,
    progress: 0,
    wpm: 0,
    errors: 0,
    finished: false,
    isHost: true,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const singleIntervalRef = useRef<any>(null);

  // Synchronize player metadata changes to localStorage & update active room
  const handleUpdateProfile = (newName: string, newAvatar: string) => {
    setName(newName);
    setAvatar(newAvatar);
    localStorage.setItem("typeracer_name", newName);
    localStorage.setItem("typeracer_avatar", newAvatar);

    const displayName = newName.trim() || "Бичээч";

    // Update single-player model
    setSinglePlayer((p) => ({ ...p, name: displayName, avatar: newAvatar }));

    // Send profile update to active room if already joined
    if (room && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Re-join to trigger server update on progress lanes
      wsRef.current.send(
        JSON.stringify({
          type: "join-room",
          code: room.code,
          name: displayName,
          avatar: newAvatar,
        })
      );
    }
  };

  // Connect to the WebSocket full-stack server
  const connectWebSocket = (): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        resolve(wsRef.current);
        return;
      }

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        wsRef.current = ws;
        resolve(ws);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type } = data;

          switch (type) {
            case "room-created":
              setClientId(data.clientId);
              setRoom(data.room);
              setErrorMsg("");
              break;

            case "room-joined":
              setClientId(data.clientId);
              setRoom(data.room);
              setErrorMsg("");
              break;

            case "room-updated":
              // Listen for countdown beeps
              const prevRoomState = room?.state;
              const nextRoom = data.room as Room;
              setRoom(nextRoom);

              if (nextRoom.state === "countdown") {
                playBeep("tick", soundOn);
              } else if (prevRoomState === "countdown" && nextRoom.state === "racing") {
                playBeep("start", soundOn);
              }
              break;

            case "error":
              setErrorMsg(data.message);
              break;

            default:
              break;
          }
        } catch (e) {
          console.error("WS parse error:", e);
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        setRoom(null);
      };

      ws.onerror = (err) => {
        console.error("WS error:", err);
        reject(err);
      };
    });
  };

  // Create room handler
  const handleCreateRoom = async (lang: "mn" | "en" | "all", difficulty: "easy" | "medium" | "hard") => {
    setErrorMsg("");
    try {
      const ws = await connectWebSocket();
      ws.send(
        JSON.stringify({
          type: "create-room",
          name: name.trim() || "Бичээч",
          avatar,
          language: lang,
          difficulty: difficulty,
        })
      );
    } catch (e) {
      setErrorMsg("Серверт холбогдож чадсангүй. Та дахин оролдоно уу.");
    }
  };

  // Start Offline Solo Practice
  const handleStartPractice = (lang: "mn" | "en", difficulty: "easy" | "medium" | "hard") => {
    if (singleIntervalRef.current) {
      clearInterval(singleIntervalRef.current);
    }
    setSoloLanguage(lang);
    setSoloDifficulty(difficulty);
    setSingleState("countdown");
    setSingleCountdown(5);
    setLocalQuote(getRandomQuote(lang, difficulty));
    setSinglePlayer((p) => ({
      ...p,
      name: name.trim() || "Бичээч",
      progress: 0,
      wpm: 0,
      errors: 0,
      finished: false,
    }));

    playBeep("tick", soundOn);

    const intervalId = setInterval(() => {
      setSingleCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          singleIntervalRef.current = null;
          setSingleState("racing");
          playBeep("start", soundOn);
          return 0;
        }
        playBeep("tick", soundOn);
        return prev - 1;
      });
    }, 1000);
    singleIntervalRef.current = intervalId;
  };

  // Join room handler
  const handleJoinRoom = async (code: string) => {
    setErrorMsg("");
    try {
      const ws = await connectWebSocket();
      ws.send(
        JSON.stringify({
          type: "join-room",
          code,
          name: name.trim() || "Бичээч",
          avatar,
        })
      );
    } catch (e) {
      setErrorMsg("Серверт холбогдож чадсангүй.");
    }
  };

  // Start countdown lobby handler (Host only)
  const handleStartGame = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "start-countdown" }));
    }
  };

  // Leave room lobby handler
  const handleLeaveRoom = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "leave-room" }));
    }
    setRoom(null);
    wsRef.current?.close();
  };

  // Change quote handler (Host only)
  const handleChangeQuote = (customQuote?: { text: string; author: string }) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "change-quote",
          quote: customQuote,
        })
      );
    }
  };

  // Active typing progress callback (Handles both local & room states)
  const handleProgressUpdate = (progress: number, wpm: number, errors: number, finished: boolean) => {
    if (finished) {
      playBeep("success", soundOn);
    } else if (errors > (room ? room.players.find(p => p.id === clientId)?.errors || 0 : singlePlayer.errors)) {
      playBeep("error", soundOn);
    }

    if (room) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "update-progress",
            progress,
            wpm,
            errors,
            finished,
          })
        );
      }
    } else {
      // Local play
      setSinglePlayer((p) => ({
        ...p,
        progress,
        wpm,
        errors,
        finished,
      }));
      if (finished) {
        setSingleState("finished");
      }
    }
  };

  // Submit high score records to global leaderboard
  const handleSubmitScore = async (wpm: number, errors: number, accuracy: number, customName?: string) => {
    const finalName = (customName || name || "").trim();
    if (!finalName) {
      setErrorMsg("Та шилдэгт орохын тулд нэрээ заавал оруулна уу!");
      setTimeout(() => setErrorMsg(""), 5000);
      return;
    }

    // Save and update profile name if they changed it on completion screen
    if (finalName !== name) {
      setName(finalName);
      localStorage.setItem("typeracer_name", finalName);
      setSinglePlayer((p) => ({ ...p, name: finalName }));
    }

    try {
      const activeQuoteText = room ? room.quote.text : localQuote.text;
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: finalName,
          wpm,
          errors,
          accuracy,
          quoteText: activeQuoteText,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Redirect to leaderboard with highlight
        setCurrentTab("leaderboard");
        // Find the newly added record in returned leaderboard to highlight it
        const newlyAdded = data.leaderboard.find((s: any) => s.name === finalName && s.wpm === wpm);
        if (newlyAdded) {
          setHighlightId(newlyAdded.id);
        } else if (data.leaderboard[0]) {
          setHighlightId(data.leaderboard[0].id);
        }
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "Оноо хадгалахад алдаа гарлаа.");
        setTimeout(() => setErrorMsg(""), 5000);
      }
    } catch (e) {
      console.error("Failed to submit score:", e);
    }
  };

  // Restart / Reset game loop
  const handleRestart = () => {
    if (room) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "restart-game" }));
      }
    } else {
      if (singleIntervalRef.current) {
        clearInterval(singleIntervalRef.current);
      }
      // Local single player restart with 5s countdown
      setSingleState("countdown");
      setSingleCountdown(5);
      setLocalQuote(getRandomQuote(soloLanguage, soloDifficulty));
      setSinglePlayer((p) => ({
        ...p,
        progress: 0,
        wpm: 0,
        errors: 0,
        finished: false,
      }));

      playBeep("tick", soundOn);

      const intervalId = setInterval(() => {
        setSingleCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            singleIntervalRef.current = null;
            setSingleState("racing");
            playBeep("start", soundOn);
            return 0;
          }
          playBeep("tick", soundOn);
          return prev - 1;
        });
      }, 1000);
      singleIntervalRef.current = intervalId;
    }
  };

  // Leave current race (works for both Solo and Multi rooms)
  const handleLeaveRace = () => {
    if (room) {
      handleLeaveRoom();
    } else {
      if (singleIntervalRef.current) {
        clearInterval(singleIntervalRef.current);
        singleIntervalRef.current = null;
      }
      setSingleState("waiting");
      setLocalQuote({ text: "", author: "" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between py-6 px-4 md:px-8 max-w-6xl mx-auto selection:bg-indigo-500/30 selection:text-white">
      {/* App Header Bar */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-800/60 pb-5 mb-8">
        {/* Title */}
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start space-x-2">
            <span className="text-2xl">🐎</span>
            <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-indigo-300 to-amber-200 font-serif">
              TYPERACER
            </h1>
            <span className="text-xs bg-indigo-500/10 text-indigo-300 font-mono border border-indigo-500/20 px-2 py-0.5 rounded">
              Монгол
            </span>
          </div>
          <p className="text-[10px] text-gray-500 font-mono tracking-wider mt-1">
            MINIMALIST CHILL MULTIPLAYER TYPING ARENA
          </p>
        </div>

        {/* Global Controls & Navigation */}
        <div className="flex items-center space-x-3">
          {/* Audio toggle button */}
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-2.5 bg-gray-800/40 hover:bg-gray-800 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition"
            title={soundOn ? "Дуу хаах" : "Дуу нээх"}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Navigation Tabs */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-1 flex items-center">
            <button
              onClick={() => setCurrentTab("lobby")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
                currentTab === "lobby"
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Keyboard className="w-4 h-4" />
              Тоглох
            </button>
            <button
              onClick={() => setCurrentTab("leaderboard")}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition ${
                currentTab === "leaderboard"
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              Шилдгүүд
            </button>
            <a
              href="https://typeracer-portfolio.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs font-semibold text-indigo-300 hover:text-indigo-100 flex items-center gap-1.5 transition"
              title="Портфолио нээх"
            >
              <span>⌨️ Typeracer</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-grow space-y-8">
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-rose-400 text-xs font-mono flex items-center gap-2"
            >
              <Info className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {currentTab === "lobby" ? (
            <motion.div
              key="lobby-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Dynamic Game Track: Shows only if player is racing or joined a room with players */}
              {(room || singleState !== "waiting") && (
                <GameTrack
                  players={room ? room.players : [singlePlayer]}
                  clientId={room ? clientId : "local-user"}
                />
              )}

              {/* Main Arena: Game Controls / Room Selection OR active race container */}
              {!room && singleState === "waiting" ? (
                <Lobby
                  room={null}
                  clientId="local-user"
                  name={name}
                  avatar={avatar}
                  onUpdateProfile={handleUpdateProfile}
                  onCreateRoom={handleCreateRoom}
                  onJoinRoom={handleJoinRoom}
                  onStartGame={handleStartGame}
                  onLeaveRoom={handleLeaveRoom}
                  onChangeQuote={() => {}}
                  onStartPractice={handleStartPractice}
                />
              ) : room && room.state === "waiting" ? (
                <Lobby
                  room={room}
                  clientId={clientId}
                  name={name}
                  avatar={avatar}
                  onUpdateProfile={handleUpdateProfile}
                  onCreateRoom={handleCreateRoom}
                  onJoinRoom={handleJoinRoom}
                  onStartGame={handleStartGame}
                  onLeaveRoom={handleLeaveRoom}
                  onChangeQuote={handleChangeQuote}
                  onStartPractice={handleStartPractice}
                />
              ) : (
                <GameArea
                  quote={room ? room.quote : localQuote}
                  gameState={room ? room.state : singleState}
                  countdown={room ? room.countdown : singleCountdown}
                  playersCount={room ? room.players.length : 1}
                  onProgressUpdate={handleProgressUpdate}
                  onRestart={handleRestart}
                  onSubmitScore={handleSubmitScore}
                  onLeaveRace={handleLeaveRace}
                  isRoom={!!room}
                  playerName={name}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="leaderboard-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <Leaderboard onBack={() => setCurrentTab("lobby")} highlightId={highlightId} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer credits with soft aesthetics */}
      <footer className="mt-12 border-t border-gray-800/40 pt-5 text-center space-y-2">
        <p className="text-[10px] text-gray-500 font-mono">
          © 2026 TYPERACER • CHILL MINIMALIST EDITION • BUILD WITH SPEED & ACCURACY
        </p>
        <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-600">
          <span>Хуруугаа амрааж, гүн амьсгал аваарай</span>
          <Heart className="w-3 h-3 text-rose-500 fill-current animate-pulse" />
        </div>
      </footer>
    </div>
  );
}
