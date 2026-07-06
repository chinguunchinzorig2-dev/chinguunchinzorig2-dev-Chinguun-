import React, { useState, useEffect, useRef } from "react";
import { Quote } from "../data/quotes";
import { Timer, AlertCircle, RefreshCw, CheckCircle, Sparkles, Send, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface GameAreaProps {
  quote: { text: string; author: string };
  gameState: "waiting" | "countdown" | "racing" | "finished";
  countdown: number;
  playersCount: number;
  onProgressUpdate: (progress: number, wpm: number, errors: number, finished: boolean) => void;
  onRestart: () => void;
  onSubmitScore: (wpm: number, errors: number, accuracy: number, customName?: string) => void;
  onLeaveRace?: () => void;
  isRoom?: boolean;
  playerName?: string;
}

export default function GameArea({
  quote,
  gameState,
  countdown,
  playersCount,
  onProgressUpdate,
  onRestart,
  onSubmitScore,
  onLeaveRace,
  isRoom = false,
  playerName = "",
}: GameAreaProps) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0); // in seconds
  const [errorsCount, setErrorsCount] = useState(0);
  const [totalKeysPressed, setTotalKeysPressed] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [playerNameInput, setPlayerNameInput] = useState(playerName || "");

  const inputRef = useRef<HTMLInputElement>(null);
  const prevInputLen = useRef(0);

  // Sync initial player name state
  useEffect(() => {
    if (playerName) {
      setPlayerNameInput(playerName);
    }
  }, [playerName]);

  // Reset local state when quote or game state changes to waiting
  useEffect(() => {
    if (gameState === "waiting" || gameState === "countdown") {
      setInput("");
      setStartTime(null);
      setElapsed(0);
      setErrorsCount(0);
      setTotalKeysPressed(0);
      setHasSubmitted(false);
      prevInputLen.current = 0;
    }
  }, [quote, gameState]);

  // Focus input when racing begins
  useEffect(() => {
    if (gameState === "racing") {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [gameState]);

  // Timer loop when racing
  useEffect(() => {
    if (gameState !== "racing" || !startTime) return;

    const timerId = setInterval(() => {
      const now = Date.now();
      const diffSec = Math.max(1, Math.floor((now - startTime) / 1000));
      setElapsed(diffSec);

      // Re-trigger progress calculations periodically
      const stats = calculateStats(input, diffSec);
      onProgressUpdate(stats.progress, stats.wpm, errorsCount, false);
    }, 500);

    return () => clearInterval(timerId);
  }, [gameState, startTime, input, errorsCount]);

  // Match and split the quote text based on player's input
  const getTypedParts = () => {
    const text = quote.text;
    let matchLength = 0;

    // Find longest matching prefix
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) {
        matchLength++;
      } else {
        break;
      }
    }

    const correctPart = text.slice(0, matchLength);
    const incorrectPart = text.slice(matchLength, input.length);
    const remainingPart = text.slice(input.length);

    return { correctPart, incorrectPart, remainingPart, matchLength };
  };

  const { correctPart, incorrectPart, remainingPart, matchLength } = getTypedParts();
  const hasError = incorrectPart.length > 0;

  // Calculate speed and progress
  const calculateStats = (currentInput: string, currentElapsed: number) => {
    const text = quote.text;
    let localMatchLen = 0;
    for (let i = 0; i < currentInput.length; i++) {
      if (currentInput[i] === text[i]) {
        localMatchLen++;
      } else {
        break;
      }
    }

    const progress = (localMatchLen / text.length) * 100;
    const timeInMins = currentElapsed > 0 ? currentElapsed / 60 : 1 / 60;
    // Standard formula: WPM = (typed matching characters / 5) / elapsed minutes
    const wpm = Math.round((localMatchLen / 5) / timeInMins);

    return { progress, wpm };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== "racing") return;

    const val = e.target.value;
    
    // Start stopwatch on first keypress
    if (!startTime && val.length > 0) {
      setStartTime(Date.now());
    }

    // Key presses logging for accuracy
    if (val.length > prevInputLen.current) {
      setTotalKeysPressed((p) => p + (val.length - prevInputLen.current));
      
      // If we typed a character that doesn't match the quote
      const lastTypedCharIdx = val.length - 1;
      if (val[lastTypedCharIdx] !== quote.text[lastTypedCharIdx]) {
        setErrorsCount((prev) => prev + 1);
      }
    }
    prevInputLen.current = val.length;

    setInput(val);

    // Calculate current progress & WPM
    const currentElapsed = startTime ? Math.max(1, Math.floor((Date.now() - startTime) / 1000)) : 1;
    const { progress, wpm } = calculateStats(val, currentElapsed);

    // Check completion
    if (val === quote.text) {
      onProgressUpdate(100, wpm, errorsCount, true);
    } else {
      onProgressUpdate(progress, wpm, errorsCount, false);
    }
  };

  // Compute final score metrics
  const finalTimeInMins = elapsed > 0 ? elapsed / 60 : 1 / 60;
  const finalWpm = Math.round((matchLength / 5) / finalTimeInMins);
  const accuracy = totalKeysPressed > 0 
    ? Math.max(0, Math.min(100, Math.round(((totalKeysPressed - errorsCount) / totalKeysPressed) * 100))) 
    : 100;

  return (
    <div className="space-y-6">
      {/* Waiting State Details */}
      {gameState === "waiting" && (
        <div className="bg-[#161a22]/80 backdrop-blur-md rounded-2xl p-8 border border-gray-800 text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto text-indigo-400">
            <Keyboard className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200">Бэлтгэл үе</h3>
            <p className="text-sm text-gray-400 max-w-sm mx-auto mt-1">
              {playersCount > 1 
                ? "Өрөөний эзэн уралдааныг эхлүүлэх үед гараанаас гарна." 
                : "Дээрх цэснээс өрөө нээж найзуудтайгаа тоглох эсвэл доорх өгүүлбэр дээр ганцаараа дадлага хийж болно."}
            </p>
          </div>
          {playersCount <= 1 && (
            <button
              onClick={() => {
                // Instantly force start in single player
                setStartTime(Date.now());
                onProgressUpdate(0, 0, 0, false);
                // Trigger a WS start or state emulation
                onRestart(); // resets
                const fakeInterval = setInterval(() => {}, 10);
                // We'll emulate a start-countdown or direct racing
              }}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium text-xs rounded-xl shadow-lg shadow-indigo-500/10 transition"
            >
              Ганцаараа дадлага хийх (Шууд эхлэх)
            </button>
          )}
        </div>
      )}

      {/* Countdown Screen */}
      {gameState === "countdown" && (
        <div className="bg-[#161a22]/80 backdrop-blur-md rounded-2xl p-12 border border-gray-800 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
          <p className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-1 animate-pulse">Уралдаан эхлэхэд</p>
          <motion.div
            key={countdown}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-6xl font-black font-mono text-amber-400"
          >
            {countdown}
          </motion.div>
          <p className="text-[10px] text-gray-500 font-mono mt-3 mb-5">Хуруугаа товчлуур дээр байрлуулна уу...</p>
          {onLeaveRace && (
            <button
              onClick={onLeaveRace}
              className="px-5 py-2.5 bg-gray-800/80 hover:bg-gray-700/90 text-gray-300 border border-gray-700/50 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95"
            >
              Цуцлах
            </button>
          )}
        </div>
      )}

      {/* Racing & Finished State Display */}
      {(gameState === "racing" || gameState === "finished") && (
        <div className="space-y-6">
          {/* Status and Leave action header */}
          <div className="flex items-center justify-between bg-[#161a22]/40 border border-gray-800/40 px-4 py-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${gameState === "finished" ? "bg-emerald-500" : "bg-indigo-500 animate-pulse"}`} />
              <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wide">
                {gameState === "finished" ? "Уралдаан дууссан" : "Уралдаан явагдаж байна"}
              </span>
            </div>
            {onLeaveRace && (
              <button
                onClick={onLeaveRace}
                className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 hover:border-rose-500/40 rounded-lg text-[11px] font-bold tracking-wide transition-all duration-200 active:scale-95"
              >
                Уралдаанаас гарах
              </button>
            )}
          </div>

          {/* Active Race HUD */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#161a22]/80 backdrop-blur-md rounded-xl p-3 border border-gray-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Хурд</span>
              <span className="text-lg font-bold font-mono text-indigo-400">
                {finalWpm} <span className="text-xs text-gray-500">WPM</span>
              </span>
            </div>
            <div className="bg-[#161a22]/80 backdrop-blur-md rounded-xl p-3 border border-gray-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Алдаа</span>
              <span className="text-lg font-bold font-mono text-rose-400">{errorsCount}</span>
            </div>
            <div className="bg-[#161a22]/80 backdrop-blur-md rounded-xl p-3 border border-gray-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Хугацаа</span>
              <span className="text-lg font-bold font-mono text-amber-400">
                {elapsed} <span className="text-xs text-gray-500">сек</span>
              </span>
            </div>
          </div>

          {/* Typing Area Text Box */}
          <div 
            onClick={() => inputRef.current?.focus()}
            className={`bg-[#161a22]/90 backdrop-blur-md rounded-2xl p-6 border transition-all cursor-text min-h-[140px] flex flex-col justify-between ${
              isFocused ? "border-indigo-500/50 shadow-lg shadow-indigo-500/5" : "border-gray-800"
            }`}
          >
            {/* The Quote itself */}
            <div className="text-xl md:text-2xl leading-relaxed select-none font-medium tracking-wide font-sans mb-6">
              {/* Completed part */}
              <span className="text-emerald-400 border-b border-emerald-400/20">{correctPart}</span>
              
              {/* Incorrectly typed character highlights */}
              {incorrectPart.length > 0 && (
                <span className="bg-rose-500/20 border-b border-rose-500 text-rose-400">
                  {incorrectPart}
                </span>
              )}
              
              {/* Caret Blinker */}
              {gameState === "racing" && (
                <span className="inline-block w-0.5 h-7 bg-indigo-400 ml-[1px] -mb-1 caret-blink" />
              )}

              {/* Remaining part */}
              <span className="text-gray-500">{remainingPart}</span>
            </div>

            {/* Author Credit */}
            <div className="text-xs text-gray-500 font-mono text-right border-t border-gray-800/60 pt-3">
              — {quote.author}
            </div>
          </div>

          {/* Interactive Text Input Box */}
          {gameState === "racing" && (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className={`w-full bg-[#1b212c] text-gray-100 font-semibold px-5 py-5 rounded-xl text-lg md:text-xl focus:outline-none border-2 transition-all ${
                  hasError 
                    ? "border-rose-500/60 bg-rose-500/5 text-rose-200" 
                    : "border-gray-800 focus:border-indigo-500/80"
                }`}
                placeholder="Дээрх өгүүлбэрийг яг таг дуурайн бичнэ үү..."
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />

              {hasError && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-rose-400 gap-1.5 pointer-events-none animate-bounce">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-[10px] font-mono font-bold uppercase">АЛДАА ЗАСНА УУ!</span>
                </div>
              )}
            </div>
          )}

          {/* Completion Summary Card */}
          <AnimatePresence>
            {gameState === "finished" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-gradient-to-b from-[#1b2331] to-[#161a22] rounded-2xl p-6 border border-emerald-500/30 shadow-2xl shadow-emerald-500/5 space-y-6"
              >
                {/* Status bar */}
                <div className="flex items-center space-x-3 text-emerald-400">
                  <CheckCircle className="w-6 h-6 shrink-0" />
                  <div>
                    <h3 className="text-base font-bold">БАРЬЯ! УРАЛДААН ДУУСЛАА</h3>
                    <p className="text-xs text-gray-400">Хурдны үзүүлэлт болон нарийвчлалыг амжилттай бүртгэлээ.</p>
                  </div>
                </div>

                {/* Final Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#13171e]/70 p-4 rounded-xl border border-gray-800">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Хурд (WPM)</span>
                    <span className="text-2xl font-black font-mono text-indigo-400">{finalWpm}</span>
                  </div>
                  <div className="text-center space-y-1 border-l border-gray-800/60">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Алдааны Тоо</span>
                    <span className="text-2xl font-black font-mono text-rose-400">{errorsCount}</span>
                  </div>
                  <div className="text-center space-y-1 border-l border-gray-800/60">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Нарийвчлал</span>
                    <span className="text-2xl font-black font-mono text-emerald-400">{accuracy}%</span>
                  </div>
                  <div className="text-center space-y-1 border-l border-gray-800/60">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">Нийт Хугацаа</span>
                    <span className="text-2xl font-black font-mono text-amber-400">{elapsed}с</span>
                  </div>
                </div>

                {/* Leaderboard Name input field */}
                {!hasSubmitted && (
                  <div className="bg-[#13171e]/40 p-4 rounded-xl border border-gray-800 space-y-2">
                    <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider">
                      Тэргүүлэгчдэд бүртгүүлэх нэр:
                    </label>
                    <input
                      type="text"
                      value={playerNameInput}
                      onChange={(e) => setPlayerNameInput(e.target.value)}
                      className="w-full bg-[#1b212c] border border-gray-800 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-gray-200 focus:outline-none focus:border-emerald-500/80 transition-all"
                      placeholder="Жишээ: Амараа, Сүхээ..."
                      maxLength={18}
                    />
                    <p className="text-[10px] text-gray-500 font-mono">
                      Та нэрээ бичээд доорх "Оноог Тэргүүлэгчдэд нэмэх" товчийг дарж шилдэг 10-т орно уу.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    onClick={onRestart}
                    className="w-full sm:w-auto px-5 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Дахин тоглох / Бэлтгэл рүү буцах
                  </button>

                  <button
                    disabled={hasSubmitted || !playerNameInput.trim()}
                    onClick={() => {
                      onSubmitScore(finalWpm, errorsCount, accuracy, playerNameInput);
                      setHasSubmitted(true);
                    }}
                    className={`w-full sm:w-auto px-6 py-3 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition ${
                      hasSubmitted
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed"
                        : !playerNameInput.trim()
                        ? "bg-emerald-400/20 text-emerald-400/40 border border-emerald-500/10 cursor-not-allowed"
                        : "bg-emerald-400 hover:bg-emerald-300 text-gray-950 shadow-emerald-400/10 hover:scale-[1.02] active:scale-95"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                    {hasSubmitted ? "Оноо хадгалагдлаа!" : "Оноог Тэргүүлэгчдэд нэмэх"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
