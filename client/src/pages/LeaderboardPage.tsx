import { motion } from "framer-motion";
import { Trophy, Flame, Medal, Crown, Award } from "lucide-react";
import type { LeaderboardItem } from "../types";

type Props = { items: LeaderboardItem[] };

const podiumColors = [
  "from-amber-500 to-yellow-400 border-amber-400/40",
  "from-slate-400 to-gray-300 border-slate-400/40",
  "from-orange-700 to-amber-600 border-orange-500/40"
];
const podiumIcons = [Crown, Medal, Award];
const podiumSizes = ["text-5xl", "text-4xl", "text-4xl"];

export default function LeaderboardPage({ items }: Props) {
  const top3 = items.slice(0, 3);
  const rest = items.slice(3);
  const displayOrder = top3.length >= 3 ? [top3[1], top3[0], top3[2]] : top3;
  const heights = ["h-28", "h-36", "h-24"];

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Trophy size={24} className="text-amber-400" /> Leaderboard
        </h1>
        <p className="mt-1 text-sm text-slate-400">See how you stack up against other learners</p>
      </motion.div>

      {/* Podium */}
      {top3.length >= 3 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <div className="flex items-end justify-center gap-4 pt-8">
            {displayOrder.map((user, idx) => {
              const originalIdx = idx === 0 ? 1 : idx === 1 ? 0 : 2;
              const Icon = podiumIcons[originalIdx];
              return (
                <motion.div
                  key={user.id}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.15, type: "spring" }}
                  className="flex flex-col items-center"
                >
                  <div className={`mb-2 flex items-center justify-center rounded-full bg-gradient-to-b ${podiumColors[originalIdx]} border p-3 shadow-lg ${idx === 1 ? "h-16 w-16" : "h-14 w-14"}`}>
                    <Icon size={idx === 1 ? 28 : 22} className="text-white" />
                  </div>
                  <div className="mb-1 text-center text-sm font-semibold">{user.name}</div>
                  <div className="mb-1 text-xs text-slate-400">{user.level}</div>
                  <div className={`font-bold ${podiumSizes[originalIdx]} gradient-text`}>#{user.rank}</div>
                  <div className={`${heights[originalIdx]} w-24 rounded-t-xl bg-gradient-to-t ${podiumColors[originalIdx]} border flex flex-col items-center justify-center`}>
                    <div className="text-lg font-bold text-white">{user.xp.toLocaleString()}</div>
                    <div className="text-xs text-white/70">XP</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Rankings Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="font-semibold">Full Rankings</h2>
        </div>
        <div className="divide-y divide-white/5">
          {items.map((user, i) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.03 }}
              className={`flex items-center justify-between px-6 py-4 transition hover:bg-white/5 ${i < 3 ? "bg-brand-500/5" : ""}`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${i === 0 ? "bg-amber-500 text-white" : i === 1 ? "bg-slate-400 text-white" : i === 2 ? "bg-orange-700 text-white" : "bg-white/10 text-slate-300"}`}>
                  {user.rank}
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>{user.level}</span>
                    {user.streak > 0 && (
                      <span className="flex items-center gap-1 text-orange-400">
                        <Flame size={12} /> {user.streak}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{user.xp.toLocaleString()} <span className="text-sm text-slate-400">XP</span></div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
