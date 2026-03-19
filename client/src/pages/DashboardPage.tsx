import { Flame, Gem, Rocket, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { DashboardPayload } from "../types";
import StatCard from "../components/StatCard";

type Props = {
  data: DashboardPayload | null;
};

export default function DashboardPage({ data }: Props) {
  if (!data) return <div className="rounded-2xl bg-white/5 p-6">Loading dashboard...</div>;

  const nextLevelTarget = data.user.xp + data.progress.remainingXp;
  const progressPct = nextLevelTarget === 0 ? 100 : Math.min(100, Math.round((data.user.xp / nextLevelTarget) * 100));

  return (
    <div className="space-y-6 py-2">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="XP" value={data.user.xp} hint={`Need ${data.progress.remainingXp} XP for ${data.progress.nextLevel}`} icon={<Star size={16} />} />
        <StatCard label="Current Level" value={data.user.level} hint="Beginner → Intermediate → Advanced → Master" icon={<Rocket size={16} />} />
        <StatCard label="Streak" value={`${data.user.streak} days`} hint="Daily practice unlocks bonus XP" icon={<Flame size={16} />} />
        <StatCard label="Coins" value={data.user.coins} hint="Redeem for premium challenge packs" icon={<Gem size={16} />} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-2 text-sm text-slate-300">XP Progress</div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-800">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} className="h-full bg-gradient-to-r from-brand-500 to-cyan-400" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Object.entries(data.progress.proficiency).map(([key, value]) => (
          <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-2 capitalize">{key}</div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-cyan-400" style={{ width: `${value}%` }} />
            </div>
            <div className="mt-2 text-sm text-slate-300">{value}% proficiency</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 text-xl font-semibold">Active Missions</div>
        <div className="grid gap-3 md:grid-cols-2">
          {data.activeChallenges.map((challenge) => (
            <div key={challenge.id} className="rounded-xl border border-white/10 bg-slate-900/50 p-4">
              <div className="mb-1 text-sm uppercase text-cyan-300">{challenge.type}</div>
              <div className="font-semibold">{challenge.title}</div>
              <div className="mt-2 text-sm text-slate-300">{challenge.subject} · {challenge.baseXp} XP · {challenge.adaptiveDifficulty}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

