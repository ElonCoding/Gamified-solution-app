import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Target, Brain, Gauge } from "lucide-react";
import type { AnalyticsPayload } from "../types";

type Props = { data: AnalyticsPayload | null };

function MetricGauge({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      className="glass-card flex flex-col items-center p-5 text-center"
    >
      <div className="mb-3">{icon}</div>
      <div className="relative h-24 w-24">
        <svg viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" opacity={0.3} />
          <motion.circle
            cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
            strokeDasharray={251.2}
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 * (1 - value / 100) }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold">{value}%</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium">{label}</span>
    </motion.div>
  );
}

export default function AnalyticsPage({ data }: Props) {
  if (!data) return <div className="flex min-h-[60vh] items-center justify-center animate-pulse text-slate-400">Loading analytics...</div>;

  const maxXp = Math.max(...data.weeklyGrowth.map((p) => p.xp), 1);

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold"><BarChart3 size={24} className="text-brand-400" /> Performance Analytics</h1>
        <p className="mt-1 text-sm text-slate-400">Track your accuracy, speed, consistency, and improvement rate</p>
      </motion.div>

      {/* Metric Gauges */}
      <div className="grid gap-4 md:grid-cols-4">
        <MetricGauge label="Accuracy" value={data.metrics.accuracy} color="#7c3aed" icon={<Target size={20} className="text-brand-400" />} />
        <MetricGauge label="Speed" value={data.metrics.speed} color="#06b6d4" icon={<Gauge size={20} className="text-cyan-400" />} />
        <MetricGauge label="Consistency" value={data.metrics.consistency} color="#10b981" icon={<TrendingUp size={20} className="text-emerald-400" />} />
        <MetricGauge label="Improvement" value={data.improvementRate} color="#f59e0b" icon={<Brain size={20} className="text-amber-400" />} />
      </div>

      {/* Weekly XP Bar Chart */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Weekly XP Growth</h2>
        <div className="flex items-end gap-4 h-48">
          {data.weeklyGrowth.map((point, i) => (
            <div key={point.week} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-sm font-medium">{point.xp}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(point.xp / maxXp) * 100}%` }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                className="w-full max-w-[60px] rounded-t-lg bg-gradient-to-t from-brand-600 to-cyan-400 min-h-[8px]"
              />
              <span className="text-xs text-slate-400">{point.week}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Proficiency Breakdown */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Skill Proficiency</h2>
        <div className="space-y-4">
          {Object.entries(data.proficiency).map(([key, value]) => (
            <div key={key}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="capitalize font-medium">{key === "softSkills" ? "Soft Skills" : key}</span>
                <span style={{ color: key === "tech" ? "#06b6d4" : key === "aptitude" ? "#f59e0b" : "#10b981" }}>{value}%</span>
              </div>
              <div className="h-3 rounded-full bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${key === "tech" ? "bg-cyan-400" : key === "aptitude" ? "bg-amber-400" : "bg-emerald-400"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Feedback */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-2xl border border-brand-500/20 bg-gradient-to-r from-brand-500/10 to-cyan-500/10 p-6">
        <div className="flex items-start gap-3">
          <Brain size={24} className="mt-0.5 text-brand-400 flex-shrink-0" />
          <div>
            <h3 className="mb-1 font-semibold text-brand-400">AI-Powered Feedback</h3>
            <p className="text-sm text-slate-300 leading-relaxed">{data.feedback}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
