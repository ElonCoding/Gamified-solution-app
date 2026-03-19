import type { DashboardPayload } from "../types";

type Props = {
  data: DashboardPayload | null;
};

export default function ProfilePage({ data }: Props) {
  if (!data) return null;
  return (
    <div className="space-y-5 py-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="text-xl font-semibold">{data.user.name}</div>
        <div className="text-slate-300">{data.user.level} learner · {data.user.coins} coins</div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-4 text-lg font-semibold">Achievements</div>
        <div className="flex flex-wrap gap-2">
          {data.user.badges.map((badge) => (
            <div key={badge} className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
              {badge}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-3 text-lg font-semibold">Unlockables</div>
        <div className="grid gap-2 text-sm text-slate-300 md:grid-cols-2">
          <div className="rounded-xl bg-slate-900/50 p-3">✅ Intermediate Challenge Pack</div>
          <div className="rounded-xl bg-slate-900/50 p-3">✅ Mentor Notes: Aptitude Strategy</div>
          <div className="rounded-xl bg-slate-900/50 p-3">🔒 Advanced Interview Arena</div>
          <div className="rounded-xl bg-slate-900/50 p-3">🔒 Master Simulation League</div>
        </div>
      </div>
    </div>
  );
}

