import type { LeaderboardItem } from "../types";

type Props = {
  items: LeaderboardItem[];
};

export default function LeaderboardPage({ items }: Props) {
  return (
    <div className="py-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 text-xl font-semibold">Global + Friends Leaderboard</div>
        <div className="space-y-3">
          {items.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/40 p-4">
              <div>
                <div className="font-medium">#{user.rank} {user.name}</div>
                <div className="text-sm text-slate-300">{user.level} · 🔥 {user.streak}</div>
              </div>
              <div className="text-lg font-semibold">{user.xp} XP</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

