import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, Target, Filter } from "lucide-react";
import api from "../api";
import type { Challenge } from "../types";
import Confetti from "../components/Confetti";

type Props = { challenges: Challenge[]; onRefresh: () => Promise<void> };
type Tab = "all" | "daily" | "weekly" | "monthly";

const diffColor = (d: string) => d === "hard" ? "badge-hard" : d === "medium" ? "badge-medium" : "badge-easy";
const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" }
];

export default function ChallengesPage({ challenges, onRefresh }: Props) {
  const [tab, setTab] = useState<Tab>("all");
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiMsg, setConfettiMsg] = useState("");

  const filtered = tab === "all" ? challenges : challenges.filter((c) => c.type === tab);

  const submit = async (challengeId: string) => {
    setLoadingId(challengeId);
    try {
      const accuracy = 70 + Math.round(Math.random() * 25);
      const timeSpentMin = 8 + Math.round(Math.random() * 30);
      const res = await api.post("/api/challenges/submit", { challengeId, accuracy, timeSpentMin });
      const d = res.data;
      setMessage(`+${d.earnedXp} XP · +${d.earnedCoins} coins · ${d.streakMultiplier > 1 ? `${d.streakMultiplier}x streak bonus · ` : ""}${d.level}`);
      if (d.isLevelUp) {
        setConfettiMsg(`🚀 Level Up! ${d.level}`);
      } else {
        setConfettiMsg(`+${d.earnedXp} XP earned!`);
      }
      setShowConfetti(true);
      await onRefresh();
    } finally {
      setLoadingId(null);
    }
  };

  const closeConfetti = useCallback(() => setShowConfetti(false), []);

  return (
    <div className="space-y-5 py-2">
      <Confetti show={showConfetti} onDone={closeConfetti} message={confettiMsg} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <Target size={24} className="text-brand-400" /> Challenges & Missions
            </h1>
            <p className="mt-1 text-sm text-slate-400">AI adapts challenge difficulty based on your accuracy trend.</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${tab === t.key ? "tab-active" : "tab-inactive"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Success Banner */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0, height: 0 }}
            animate={{ scale: 1, opacity: 1, height: "auto" }}
            exit={{ scale: 0.95, opacity: 0, height: 0 }}
            className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-emerald-200"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">🎉</span>
              <span className="font-medium">Mission complete!</span>
              <span>{message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((challenge, i) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -2 }}
            className={`glass-card overflow-hidden p-5 transition-shadow hover:shadow-glow ${challenge.completed ? "opacity-60" : ""}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-300">
                {challenge.type}
              </span>
              <span className={`rounded-full border px-3 py-1 text-xs font-medium ${diffColor(challenge.adaptiveDifficulty)}`}>
                {challenge.adaptiveDifficulty}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{challenge.title}</h3>
            {challenge.description && <p className="mt-1 text-sm text-slate-400">{challenge.description}</p>}
            <div className="mt-3 flex items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1"><Zap size={14} className="text-amber-400" />{challenge.baseXp} XP</span>
              <span className="flex items-center gap-1"><Clock size={14} className="text-cyan-400" />{challenge.timeLimitMin} min</span>
              <span>{challenge.subject}</span>
            </div>
            <button
              disabled={loadingId === challenge.id || challenge.completed}
              onClick={() => submit(challenge.id)}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-glow-sm transition hover:shadow-glow-brand disabled:opacity-50"
            >
              {challenge.completed ? "✅ Completed" : loadingId === challenge.id ? "Submitting..." : "Start Challenge"}
            </button>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="glass-card flex min-h-[200px] items-center justify-center p-6 text-slate-400">
          No {tab} challenges available.
        </div>
      )}
    </div>
  );
}
