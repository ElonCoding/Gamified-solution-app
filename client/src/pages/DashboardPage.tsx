import { Flame, Gem, Rocket, Star, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { DashboardPayload } from "../types";
import StatCard from "../components/StatCard";
import ProgressRing from "../components/ProgressRing";

type Props = { data: DashboardPayload | null };

const diffColor = (d: string) => d === "hard" ? "badge-hard" : d === "medium" ? "badge-medium" : "badge-easy";

export default function DashboardPage({ data }: Props) {
  if (!data) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse text-slate-400">Loading dashboard...</div>
    </div>
  );

  const { user, progress, activeChallenges } = data;

  return (
    <div className="space-y-6 py-2">
      {/* Welcome + Level */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <div className="relative">
              <ProgressRing value={progress.levelProgress} size={100} color="#7c3aed" label={`${progress.levelProgress}%`} sublabel={user.level} />
              <div className="absolute -right-1 -top-1 rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 p-1.5 text-xs shadow-glow-sm">
                {user.level === "Master" ? "👑" : user.level === "Advanced" ? "🔥" : user.level === "Intermediate" ? "⚡" : "🌱"}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
              <p className="text-sm text-slate-400">
                {progress.remainingXp > 0 ? `${progress.remainingXp} XP until ${progress.nextLevel}` : "Max level reached!"}
              </p>
              {progress.streakMultiplier > 1 && (
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-400">
                  <Zap size={12} /> {progress.streakMultiplier}x XP Multiplier Active
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-1 justify-end">
            <div className="flex items-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-5 py-3">
              <Flame size={22} className="animate-fire text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-orange-400">{user.streak}</div>
                <div className="text-xs text-orange-300">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Total XP" value={user.xp.toLocaleString()} hint={`${progress.remainingXp} to ${progress.nextLevel}`} icon={<Star size={16} className="text-brand-400" />} />
        <StatCard label="Level" value={user.level} hint="Beginner → Intermediate → Advanced → Master" icon={<Rocket size={16} className="text-cyan-400" />} />
        <StatCard label="Coins" value={user.coins.toLocaleString()} hint="Redeem for premium packs" icon={<Gem size={16} className="text-amber-400" />} />
        <StatCard label="Badges" value={user.badges.length} hint={user.badges.slice(0, 3).join(", ") || "Complete challenges to earn"} icon={<TrendingUp size={16} className="text-emerald-400" />} />
      </div>

      {/* XP Progress Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">XP Progress to {progress.nextLevel}</span>
          <span className="text-sm text-brand-400">{progress.levelProgress}%</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress.levelProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand-500 via-purple-400 to-cyan-400"
          />
        </div>
      </motion.div>

      {/* Proficiency */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(progress.proficiency).map(([key, value], i) => (
          <motion.div key={key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="glass-card p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="capitalize font-medium">{key === "softSkills" ? "Soft Skills" : key}</span>
              <span className="text-sm text-brand-400">{value}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className={`h-full rounded-full ${key === "tech" ? "bg-cyan-400" : key === "aptitude" ? "bg-amber-400" : "bg-emerald-400"}`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active Missions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <h2 className="mb-4 text-xl font-semibold flex items-center gap-2">
          <Rocket size={20} className="text-brand-400" /> Active Missions
        </h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {activeChallenges.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl border border-white/10 bg-slate-900/50 p-4 transition hover:border-brand-500/30"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-cyan-400">{c.type}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs ${diffColor(c.adaptiveDifficulty)}`}>
                  {c.adaptiveDifficulty}
                </span>
              </div>
              <div className="font-semibold">{c.title}</div>
              <div className="mt-2 text-sm text-slate-400">{c.subject} · {c.baseXp} XP · {c.timeLimitMin} min</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
