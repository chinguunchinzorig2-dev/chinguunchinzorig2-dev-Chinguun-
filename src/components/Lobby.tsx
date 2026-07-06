import React, { useState } from "react";
import { Player, Room } from "../types";
import { Users, Sparkles, Copy, Check, LogOut, Play, Globe, Gamepad2, ArrowRight, User } from "lucide-react";
import { motion } from "motion/react";

interface LobbyProps {
  room: Room | null;
  clientId: string;
  name: string;
  avatar: string;
  onUpdateProfile: (name: string, avatar: string) => void;
  onCreateRoom: (lang: "mn" | "en" | "all", difficulty: "easy" | "medium" | "hard") => void;
  onJoinRoom: (code: string) => void;
  onStartGame: () => void;
  onLeaveRoom: () => void;
  onChangeQuote: (customQuote?: { text: string; author: string }) => void;
  onStartPractice: (lang: "mn" | "en", difficulty: "easy" | "medium" | "hard") => void;
}

const VEHICLES = [
  { emoji: "🐎", label: "Морь" },
  { emoji: "🚗", label: "Машин" },
  { emoji: "🏎️", label: "Формула" },
  { emoji: "🚀", label: "Пуужин" },
  { emoji: "🛹", label: "Скэйт" },
  { emoji: "🛸", label: "Хөлөг" },
  { emoji: "🏍️", label: "Мотоцикл" },
  { emoji: "🦄", label: "Юникорн" },
  { emoji: "🐉", label: "Луу" },
  { emoji: "🐆", label: "Ирвэс" },
  { emoji: "🦅", label: "Бүргэд" },
  { emoji: "🚂", label: "Галт тэрэг" },
  { emoji: "🦖", label: "Дино" },
  { emoji: "🐪", label: "Тэмээ" },
  { emoji: "🦁", label: "Арслан" },
  { emoji: "🐯", label: "Бар" },
  { emoji: "🐺", label: "Чоно" },
  { emoji: "🦊", label: "Үнэг" },
  { emoji: "🚁", label: "Нисдэг тэрэг" },
  { emoji: "🚲", label: "Дугуй" },
  { emoji: "🐢", label: "Мэлхий" },
  { emoji: "✈️", label: "Онгоц" },
  { emoji: "🦈", label: "Акул" },
  { emoji: "🦌", label: "Буга" }
];

export default function Lobby({
  room,
  clientId,
  name,
  avatar,
  onUpdateProfile,
  onCreateRoom,
  onJoinRoom,
  onStartGame,
  onLeaveRoom,
  onChangeQuote,
  onStartPractice,
}: LobbyProps) {
  const [joinCode, setJoinCode] = useState("");
  const [langSelect, setLangSelect] = useState<"mn" | "en" | "all">("mn");
  const [difficultySelect, setDifficultySelect] = useState<"easy" | "medium" | "hard">("medium");

  // Local Practice Selections
  const [practiceLang, setPracticeLang] = useState<"mn" | "en">("mn");
  const [practiceDifficulty, setPracticeDifficulty] = useState<"easy" | "medium" | "hard">("medium");

  const [copied, setCopied] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const copyRoomCode = () => {
    if (!room) return;
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateAiQuote = async () => {
    if (!room) return;
    setLoadingAi(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/gemini/generate-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: room.language === "all" ? "mn" : room.language })
      });
      if (res.ok) {
        const data = await res.json();
        onChangeQuote({ text: data.text, author: data.author });
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "AI өгүүлбэр үүсгэж чадсангүй.");
      }
    } catch (e) {
      setErrorMsg("Сүлжээний алдаа. AI өгүүлбэр авах боломжгүй байна.");
    } finally {
      setLoadingAi(false);
    }
  };

  const isHost = room?.players.find(p => p.id === clientId)?.isHost;

  // Render Waiting room screen
  if (room) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-[#161a22]/80 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-2xl space-y-6">
        {/* Lobby Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-800 pb-5 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ROOM LOBBY ACTIVATED</span>
            </div>
            <h2 className="text-xl font-bold text-gray-100 tracking-tight flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-indigo-400" />
              Хамтран тоглох өрөө
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-400 font-mono">Өрөөний код:</span>
            <div className="bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg flex items-center space-x-2 font-mono text-base font-bold text-amber-400">
              <span>{room.code}</span>
              <button onClick={copyRoomCode} className="text-gray-400 hover:text-white transition">
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quote preview container */}
        <div className="bg-[#1b212c]/60 rounded-xl p-4 border border-gray-800/80">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Тоглох өгүүлбэр:</h3>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-1.5 py-0.5 rounded uppercase font-mono">
                {room.difficulty || "Дунд"}
              </span>
            </div>
            {isHost && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onChangeQuote()}
                  disabled={loadingAi}
                  className="px-2 py-1 text-[11px] font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-700 transition"
                >
                  Санамсаргүй өөрчлөх
                </button>
                <button
                  onClick={handleGenerateAiQuote}
                  disabled={loadingAi}
                  className="px-2 py-1 text-[11px] font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 flex items-center gap-1 transition"
                >
                  <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
                  {loadingAi ? "AI уншиж байна..." : "AI өгүүлбэр үүсгэх"}
                </button>
              </div>
            )}
          </div>
          <div className="text-sm font-medium text-gray-300 italic mb-2 line-clamp-2 leading-relaxed">
            "{room.quote.text}"
          </div>
          <div className="text-[11px] text-gray-500 font-mono text-right">— {room.quote.author}</div>
          {errorMsg && <p className="text-xs text-red-400 mt-2 font-mono">{errorMsg}</p>}
        </div>

        {/* Players joined list */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-gray-400 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Холбогдсон тоглогчид ({room.players.length}/8)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {room.players.map((p) => {
              const isMe = p.id === clientId;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border ${
                    isMe
                      ? "bg-indigo-500/5 border-indigo-500/30 shadow-md shadow-indigo-500/2"
                      : "bg-[#1c212d]/40 border-gray-800/80"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{p.avatar}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-200 flex items-center gap-1.5">
                        {p.name}
                        {isMe && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">чи</span>}
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono uppercase">
                        {p.isHost ? "Өрөөний эзэн" : "Залуу тамирчин"}
                      </span>
                    </div>
                  </div>
                  {p.isHost && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full font-mono">
                      HOST
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lobby Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
          <button
            onClick={onLeaveRoom}
            className="px-4 py-2 text-sm font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 rounded-xl border border-red-500/20 flex items-center gap-2 transition"
          >
            <LogOut className="w-4 h-4" />
            Өрөөнөөс гарах
          </button>

          {isHost ? (
            <button
              onClick={onStartGame}
              className="px-6 py-2.5 text-sm font-bold text-gray-950 bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-400/10 hover:scale-[1.02] active:scale-95 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              Уралдааныг эхлүүлэх
            </button>
          ) : (
            <div className="text-xs text-amber-400 bg-amber-400/5 border border-amber-400/10 px-3 py-2 rounded-lg font-mono animate-pulse">
              Өрөөний эзэн уралдааныг эхлүүлэхийг хүлээнэ үү...
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Setup/Join/Create Screen
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Profile Card */}
      <div className="bg-[#161a22]/80 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-2xl space-y-6">
        <h2 className="text-lg font-semibold text-gray-200 tracking-tight border-b border-gray-800 pb-3">
          1. Тамирчны тохиргоо
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Нэрээ оруулна уу:</label>
            <input
              type="text"
              value={name}
              maxLength={14}
              onChange={(e) => onUpdateProfile(e.target.value, avatar)}
              className="w-full bg-[#1b212c] border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-200 focus:outline-none focus:border-indigo-500/80 font-medium transition"
              placeholder="Бичээч"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Морь, унаагаа сонгох:</label>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2.5">
              {VEHICLES.map((v) => {
                const isSelected = avatar === v.emoji;
                return (
                  <button
                    key={v.emoji}
                    onClick={() => onUpdateProfile(name, v.emoji)}
                    className={`flex flex-col items-center justify-center py-2 rounded-xl border transition ${
                      isSelected
                        ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-300"
                        : "bg-[#1b212c]/50 border-gray-800/80 hover:border-gray-700 text-gray-400"
                    }`}
                  >
                    <span className="text-3xl mb-1">{v.emoji}</span>
                    <span className="text-[10px] font-medium">{v.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Grid containing Solo, Create Room, and Join Room */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 1. Solo Practice */}
        <div className="bg-[#161a22]/85 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-2xl flex flex-col justify-between min-h-[470px] hover:border-indigo-500/30 transition-colors duration-300">
          <div>
            <h2 className="text-xl font-extrabold text-gray-200 tracking-tight border-b border-gray-800/60 pb-3 mb-4 text-indigo-400">
              Ганцаараа дадлага
            </h2>
            <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
              Интернэт холболт хамаарахгүйгээр ганцаараа бичих хурдаа сайжруулж дадлага хийнэ.
            </p>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-2">Хэлний сонголт:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "mn", label: "Монгол" },
                    { value: "en", label: "English" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPracticeLang(opt.value as any)}
                      className={`py-3 rounded-xl border text-sm font-bold tracking-wide transition-all duration-200 ${
                        practiceLang === opt.value
                          ? "bg-indigo-500/15 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/5 scale-[1.02]"
                          : "bg-[#1b212c]/60 border-gray-800 hover:border-gray-700 text-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-2">Түвшин (Хэцүү):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "easy", label: "Амархан" },
                    { value: "medium", label: "Дунд" },
                    { value: "hard", label: "Хэцүү" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPracticeDifficulty(opt.value as any)}
                      className={`py-2.5 rounded-xl border text-xs font-bold tracking-wide transition-all duration-200 ${
                        practiceDifficulty === opt.value
                          ? "bg-amber-400/15 border-amber-400 text-amber-300 shadow-md shadow-amber-400/5 scale-[1.02]"
                          : "bg-[#1b212c]/60 border-gray-800 hover:border-gray-700 text-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartPractice(practiceLang, practiceDifficulty)}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <User className="w-4 h-4" />
            Уралдаан эхлэх
          </button>
        </div>

        {/* 2. Create room */}
        <div className="bg-[#161a22]/85 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-2xl flex flex-col justify-between min-h-[470px] hover:border-emerald-500/30 transition-colors duration-300">
          <div>
            <h2 className="text-xl font-extrabold text-gray-200 tracking-tight border-b border-gray-800/60 pb-3 mb-4 text-emerald-400">
              Шинэ өрөө нээх
            </h2>
            <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
              Найзуудаа урин хамтдаа уралдах онлайн өрөө нээнэ. Кодоо хуваалцаарай!
            </p>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-2">Хэлний сонголт:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "mn", label: "Монгол" },
                    { value: "en", label: "English" },
                    { value: "all", label: "Mixed" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setLangSelect(opt.value as any)}
                      className={`py-3 rounded-xl border text-xs font-bold tracking-wide transition-all duration-200 ${
                        langSelect === opt.value
                          ? "bg-indigo-500/15 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/5 scale-[1.02]"
                          : "bg-[#1b212c]/60 border-gray-800 hover:border-gray-700 text-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-2">Түвшин (Хэцүү):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "easy", label: "Амархан" },
                    { value: "medium", label: "Дунд" },
                    { value: "hard", label: "Хэцүү" }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDifficultySelect(opt.value as any)}
                      className={`py-2.5 rounded-xl border text-xs font-bold tracking-wide transition-all duration-200 ${
                        difficultySelect === opt.value
                          ? "bg-amber-400/15 border-amber-400 text-amber-300 shadow-md shadow-amber-400/5 scale-[1.02]"
                          : "bg-[#1b212c]/60 border-gray-800 hover:border-gray-700 text-gray-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onCreateRoom(langSelect, difficultySelect)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Globe className="w-4 h-4" />
            Өрөө нээх
          </button>
        </div>

        {/* 3. Join room */}
        <div className="bg-[#161a22]/85 backdrop-blur-md rounded-2xl p-8 border border-gray-800 shadow-2xl flex flex-col justify-between min-h-[470px] hover:border-amber-500/30 transition-colors duration-300">
          <div>
            <h2 className="text-xl font-extrabold text-gray-200 tracking-tight border-b border-gray-800/60 pb-3 mb-4 text-amber-400">
              Өрөөнд нэгдэх
            </h2>
            <p className="text-[13px] text-gray-400 mb-6 leading-relaxed">
              Найзынхаа үүсгэсэн өрөөний 4 оронтой кодыг оруулан уралдаанд шууд нэгдэнэ.
            </p>

            <div className="space-y-4 mb-6">
              <label className="block text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider mb-2">Өрөөний код:</label>
              <input
                type="text"
                value={joinCode}
                maxLength={4}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().trim())}
                className="w-full bg-[#1b212c] border border-gray-800 rounded-xl px-4 py-4 text-xl text-amber-400 font-mono font-bold tracking-widest text-center focus:outline-none focus:border-amber-500/80 transition-all"
                placeholder="ABCD"
              />
            </div>
          </div>

          <button
            onClick={() => onJoinRoom(joinCode)}
            disabled={!joinCode}
            className="w-full py-4 bg-amber-400 disabled:opacity-40 hover:bg-amber-300 text-gray-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-400/10 disabled:cursor-not-allowed active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Нэгдэх
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
