import React from "react";
import { Player } from "../types";
import { motion } from "motion/react";

interface GameTrackProps {
  players: Player[];
  clientId: string;
}

export default function GameTrack({ players, clientId }: GameTrackProps) {
  return (
    <div className="w-full bg-[#161a22]/80 backdrop-blur-md rounded-2xl p-6 border border-gray-800 shadow-2xl space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Уралдааны зам</h3>
        <div className="flex space-x-3 text-[10px] font-mono text-gray-500">
          <span>🚩 ЭХЛЭЛ</span>
          <span>🏁 БАРИА</span>
        </div>
      </div>

      <div className="space-y-3">
        {players.map((player) => {
          const isMe = player.id === clientId;
          
          return (
            <div key={player.id} className="space-y-1">
              {/* Lane Info */}
              <div className="flex justify-between items-center px-1">
                <span className={`text-xs font-medium flex items-center gap-1.5 ${isMe ? "text-indigo-400" : "text-gray-300"}`}>
                  <span className="text-base">{player.avatar}</span>
                  {player.name}
                  {isMe && <span className="text-[9px] bg-indigo-500/15 text-indigo-300 px-1 py-0.2 rounded">ЧИ</span>}
                </span>
                
                <span className="text-[10px] font-mono text-gray-400">
                  {player.finished ? (
                    <span className="text-emerald-400 font-bold">БАРИАНД ОРСОН • {player.wpm} WPM</span>
                  ) : (
                    <span>{player.wpm} WPM ({Math.round(player.progress)}%)</span>
                  )}
                </span>
              </div>

              {/* Racetrack lane */}
              <div className="relative h-14 w-full bg-gradient-to-r from-[#181d28] via-[#151922] to-[#1e2533] rounded-xl border border-gray-800/80 overflow-hidden flex items-center">
                {/* Mid-lane dashed dividers for a highway/track feel */}
                <div className="absolute inset-x-0 h-[1px] border-t border-dashed border-gray-800" />
                
                {/* Lane overlay for completed state */}
                {player.finished && (
                  <div className="absolute inset-y-0 left-0 bg-emerald-500/5 animate-fade-in w-full transition-all" />
                )}

                {/* Starting Grid Line */}
                <div className="absolute left-6 inset-y-0 w-[2px] bg-indigo-500/10 border-l border-dashed border-indigo-500/20" />
                
                {/* Checkered Finish Line flag strip */}
                <div className="absolute right-6 inset-y-0 w-3 flex flex-col justify-between opacity-30 select-none pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2.5 w-full ${i % 2 === 0 ? "bg-white" : "bg-black"}`} 
                    />
                  ))}
                </div>

                {/* Racer Vehicle */}
                <motion.div
                  className="absolute z-10 cursor-default flex flex-col items-center justify-center"
                  initial={{ left: "1.5rem" }}
                  animate={{ 
                    left: `calc(1.5rem + ${player.progress * 0.85}% - 12px)` 
                  }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 70, 
                    damping: 18 
                  }}
                >
                  <span className="text-3xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.5)] transform -scale-x-100 hover:scale-110 active:scale-95 transition-transform duration-200">
                    {player.avatar}
                  </span>
                  
                  {/* Small progress indicator tail bubble */}
                  <div className="mt-0.5 px-1 py-0.2 bg-gray-900/80 border border-gray-800 rounded text-[8px] font-mono text-gray-400 scale-75 whitespace-nowrap">
                    {player.wpm} WPM
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
