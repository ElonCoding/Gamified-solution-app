import { useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import type { Challenge } from "../types";

type Props = {
  challenges: Challenge[];
  onRefresh: () => Promise<void>;
};

export default function ChallengesPage({ challenges, onRefresh }: Props) {
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const submit = async (challengeId: string) => {
    setLoadingId(challengeId);
    try {
      const accuracy = 70 + Math.round(Math.random() * 25);
      const timeSpentMin = 8 + Math.round(Math.random() * 30);
      const response = await api.post("/api/challenges/submit", { challengeId, accuracy, timeSpentMin });
      setMessage(`+${response.data.earnedXp} XP · +${response.data.earnedCoins} coins · ${response.data.level}`);
      await onRefresh();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-5 py-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-2 text-xl font-semibold">Daily · Weekly · Monthly Challenges</div>
        <div className="text-sm text-slate-300">AI adapts challenge difficulty based on your accuracy trend.</div>
      </div>
      {message && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-4 text-cyan-200">
          🎉 Mission complete! {message}
        </motion.div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="mb-1 text-xs uppercase tracking-wider text-cyan-300">{challenge.type}</div>
            <div className="text-lg font-semibold">{challenge.title}</div>
            <div className="mt-2 text-sm text-slate-300">{challenge.subject} · {challenge.baseXp} XP · {challenge.timeLimitMin} min</div>
            <div className="mt-1 text-sm text-slate-400">Recommended: {challenge.adaptiveDifficulty}</div>
            <button
              disabled={loadingId === challenge.id}
              onClick={() => submit(challenge.id)}
              className="mt-4 w-full rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium"
            >
              {loadingId === challenge.id ? "Submitting..." : "Start Challenge"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

