type AnalyticsPayload = {
  weeklyGrowth: { week: string; xp: number }[];
  metrics: { accuracy: number; speed: number; consistency: number };
  proficiency: { tech: number; aptitude: number; softSkills: number };
  feedback: string;
};

type Props = {
  data: AnalyticsPayload | null;
};

export default function AnalyticsPage({ data }: Props) {
  if (!data) return <div className="rounded-2xl bg-white/5 p-6">Loading analytics...</div>;

  return (
    <div className="space-y-5 py-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-3 text-xl font-semibold">Performance Analytics</div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-900/50 p-4">Accuracy: {data.metrics.accuracy}%</div>
          <div className="rounded-xl bg-slate-900/50 p-4">Speed: {data.metrics.speed}%</div>
          <div className="rounded-xl bg-slate-900/50 p-4">Consistency: {data.metrics.consistency}%</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-3 text-lg font-semibold">Weekly XP Progress Report</div>
        <div className="space-y-3">
          {data.weeklyGrowth.map((point) => (
            <div key={point.week}>
              <div className="mb-1 flex justify-between text-sm"><span>{point.week}</span><span>{point.xp} XP</span></div>
              <div className="h-3 rounded-full bg-slate-800">
                <div className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-cyan-400" style={{ width: `${Math.min(point.xp / 15, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-6 text-cyan-100">
        AI Feedback: {data.feedback}
      </div>
    </div>
  );
}

