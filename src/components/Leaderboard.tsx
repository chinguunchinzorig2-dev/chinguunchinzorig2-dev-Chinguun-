import React, { useEffect, useState } from "react";
import { ScoreRecord } from "../types";
import { Trophy, Calendar, Sparkles, Activity } from "lucide-react";
import { motion } from "motion/react";

interface LeaderboardProps {
  onBack?: () => void;
  highlightId?: string;
}

export default function Leaderboard({ onBack, highlightId }: LeaderboardProps) {
  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setScores(data);
      }
    } catch (e) {
      console.error("Failed to fetch leaderboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("mn-MN", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#161a22]/80 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100 tracking-tight">ТОП 10 Leaderboard</h2>
            <p className="text-xs text-gray-400 font-mono">Хамгийн хурдан бичдэг мастерууд</p>
          </div>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all"
          >
            Буцах
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <Activity className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-sm font-mono text-gray-500">Онооны жагсаалтыг ачаалж байна...</p>
        </div>
      ) : scores.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">Одоогоор оноо хадгалагдаагүй байна. Эхнийх нь болоорой!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {scores.map((score, index) => {
            const isHighlighted = highlightId === score.id;
            const rank = index + 1;

            return (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  isHighlighted
                    ? "bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5"
                    : "bg-[#1d2330]/50 border-gray-800/60 hover:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-mono text-sm font-bold ${
                    rank === 1 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                    rank === 2 ? "bg-slate-300/20 text-slate-300 border border-slate-300/30" :
                    rank === 3 ? "bg-amber-700/20 text-amber-600 border border-amber-700/30" :
                    "bg-gray-800/40 text-gray-400"
                  }`}>
                    {rank}
                  </div>

                  <div>
                    <span className="font-medium text-gray-200 block md:inline mr-2 text-sm md:text-base">
                      {score.name}
                    </span>
                    {score.quoteText && (
                      <span className="hidden md:inline text-xs font-mono text-gray-500 line-clamp-1 max-w-xs italic">
                        "{score.quoteText}"
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-emerald-400">{score.wpm}</span>
                    <span className="text-xs text-gray-500 font-mono ml-1">WPM</span>
                    <div className="text-[10px] text-gray-400 font-mono">
                      Алдаа: {score.errors} • {score.accuracy}% зөв
                    </div>
                  </div>

                  <div className="hidden sm:flex flex-col items-end text-right">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-600" />
                      {formatDate(score.timestamp)}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
