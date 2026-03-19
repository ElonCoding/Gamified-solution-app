import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Settings, BarChart3, Users, Rocket, Database, Sliders, Plus, Trash2, Search, ChevronRight } from "lucide-react";
import api from "../api";
import type { AdminStats, AdminUser, AdminSubmission, Challenge } from "../types";

type Tab = "basic" | "intermediate" | "advanced";

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("basic");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [system, setSystem] = useState<any>(null);
  const [tuning, setTuning] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // New challenge form
  const [newChallenge, setNewChallenge] = useState({ title: "", type: "daily", subject: "Tech", baseXp: 40, difficulty: "easy", timeLimitMin: 10, description: "" });

  const load = async () => {
    try {
      const [s, u, c, sub] = await Promise.all([
        api.get("/api/admin/stats"),
        api.get("/api/admin/users"),
        api.get("/api/admin/challenges"),
        api.get("/api/admin/submissions")
      ]);
      setStats(s.data);
      setUsers(u.data.items);
      setChallenges(c.data.items);
      setSubmissions(sub.data.items);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Access denied");
    }
    try {
      const [sys, tun] = await Promise.all([
        api.get("/api/admin/system"),
        api.get("/api/admin/tuning")
      ]);
      setSystem(sys.data);
      setTuning(tun.data);
    } catch { /* superadmin only - silently fail for admins */ }
  };

  useEffect(() => { load(); }, []);

  const createChallenge = async () => {
    if (!newChallenge.title) return;
    await api.post("/api/admin/challenges", newChallenge);
    setNewChallenge({ title: "", type: "daily", subject: "Tech", baseXp: 40, difficulty: "easy", timeLimitMin: 10, description: "" });
    load();
  };

  const deleteChallenge = async (id: string) => {
    await api.delete(`/api/admin/challenges/${id}`);
    load();
  };

  const updateTuning = async (key: string, value: number) => {
    await api.put("/api/admin/tuning", { [key]: value });
    const res = await api.get("/api/admin/tuning");
    setTuning(res.data);
  };

  if (error) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="glass-card p-8 text-center">
        <Shield size={40} className="mx-auto mb-4 text-rose-400" />
        <p className="text-lg font-semibold text-rose-400">{error}</p>
        <p className="mt-2 text-sm text-slate-400">Admin access required. Login with admin@gamifyu.com / admin123</p>
      </div>
    </div>
  );

  const filteredUsers = search ? users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) : users;

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold"><Settings size={24} className="text-brand-400" /> Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-400">Manage platform content, users, analytics, and system behavior</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto">
        {([
          { key: "basic", label: "Basic", icon: Rocket, desc: "Content & Monitoring" },
          { key: "intermediate", label: "Intermediate", icon: BarChart3, desc: "Analytics & Insights" },
          { key: "advanced", label: "Advanced", icon: Database, desc: "System & AI Tuning" }
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-3 rounded-2xl px-5 py-3 text-sm font-medium transition ${tab === t.key ? "bg-brand-600 text-white shadow-glow-sm" : "glass-card hover:bg-white/10"}`}
          >
            <t.icon size={18} />
            <div className="text-left">
              <div>{t.label}</div>
              <div className="text-[10px] opacity-70">{t.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ═══ BASIC PANEL ═══ */}
      {tab === "basic" && (
        <div className="space-y-6">
          {/* Stats Overview */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-5">
              {[
                { label: "Users", value: stats.totalUsers, color: "text-brand-400" },
                { label: "Challenges", value: stats.totalChallenges, color: "text-cyan-400" },
                { label: "Submissions", value: stats.totalSubmissions, color: "text-emerald-400" },
                { label: "Avg XP", value: stats.avgXp, color: "text-amber-400" },
                { label: "Active Streaks", value: stats.activeStreaks, color: "text-orange-400" }
              ].map((s) => (
                <motion.div key={s.label} whileHover={{ scale: 1.03 }} className="glass-card p-4 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">{s.label}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Challenge Management */}
          <div className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Rocket size={20} className="text-cyan-400" /> Challenge Management</h2>
            <div className="mb-4 grid gap-3 rounded-xl border border-white/10 bg-slate-900/40 p-4 md:grid-cols-4">
              <input value={newChallenge.title} onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm" placeholder="Challenge title" />
              <select value={newChallenge.type} onChange={(e) => setNewChallenge({ ...newChallenge, type: e.target.value })} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm">
                <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
              </select>
              <select value={newChallenge.difficulty} onChange={(e) => setNewChallenge({ ...newChallenge, difficulty: e.target.value })} className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm">
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
              <button onClick={createChallenge} className="flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium hover:bg-brand-500">
                <Plus size={16} /> Add
              </button>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-auto">
              {challenges.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl bg-slate-900/40 p-3">
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${c.difficulty === "hard" ? "badge-hard" : c.difficulty === "medium" ? "badge-medium" : "badge-easy"}`}>{c.difficulty}</span>
                    <div>
                      <div className="text-sm font-medium">{c.title}</div>
                      <div className="text-xs text-slate-400">{c.type} · {c.subject} · {c.baseXp} XP</div>
                    </div>
                  </div>
                  <button onClick={() => deleteChallenge(c.id)} className="rounded-lg p-2 text-rose-400 transition hover:bg-rose-500/10"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Simple User List */}
          <div className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Users size={20} className="text-amber-400" /> Users</h2>
            <div className="space-y-2 max-h-[300px] overflow-auto">
              {users.filter((u) => u.role === "user").map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-xl bg-slate-900/40 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-sm font-bold">{u.name.charAt(0)}</div>
                    <div>
                      <div className="text-sm font-medium">{u.name}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm"><span className="text-brand-400">{u.xp} XP</span> · <span className="text-slate-400">{u.level}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ INTERMEDIATE PANEL ═══ */}
      {tab === "intermediate" && (
        <div className="space-y-6">
          {/* Level Distribution */}
          {stats && (
            <div className="glass-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Level Distribution</h2>
              <div className="flex items-end gap-4 h-40">
                {Object.entries(stats.levelDistribution).map(([level, count], i) => (
                  <div key={level} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-sm font-bold">{count}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(8, (count / Math.max(...Object.values(stats.levelDistribution), 1)) * 100)}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className={`w-full max-w-[60px] rounded-t-lg ${i === 0 ? "bg-emerald-400" : i === 1 ? "bg-cyan-400" : i === 2 ? "bg-amber-400" : "bg-brand-400"}`}
                    />
                    <span className="text-xs text-slate-400">{level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Performers */}
          {stats && (
            <div className="glass-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Top Performers</h2>
              <div className="space-y-2">
                {stats.topPerformers.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between rounded-xl bg-slate-900/40 p-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${i === 0 ? "bg-amber-500 text-white" : i === 1 ? "bg-slate-400 text-white" : i === 2 ? "bg-orange-700 text-white" : "bg-white/10"}`}>
                        {i + 1}
                      </span>
                      <div><span className="font-medium">{p.name}</span> <span className="text-sm text-slate-400">· {p.level}</span></div>
                    </div>
                    <span className="text-brand-400 font-medium">{p.xp.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* User Search & Management */}
          <div className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Users size={20} /> User Insights</h2>
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3">
              <Search size={16} className="text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 bg-transparent py-2 text-sm outline-none" placeholder="Search users..." />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-auto">
              {filteredUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between rounded-xl bg-slate-900/40 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20 text-sm font-bold">{u.name.charAt(0)}</div>
                    <div>
                      <div className="text-sm font-medium">{u.name} <span className={`ml-1 text-xs ${u.role === "admin" ? "text-amber-400" : u.role === "superadmin" ? "text-rose-400" : "text-slate-400"}`}>({u.role})</span></div>
                      <div className="text-xs text-slate-400">{u.email} · 🔥{u.streak} · {u.badges.length} badges</div>
                    </div>
                  </div>
                  <div className="text-right"><span className="text-brand-400">{u.xp} XP</span></div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="glass-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Recent Submissions</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-white/10 text-left">
                  <th className="pb-2 pr-4 text-slate-400">User</th>
                  <th className="pb-2 pr-4 text-slate-400">Challenge</th>
                  <th className="pb-2 pr-4 text-slate-400">Accuracy</th>
                  <th className="pb-2 pr-4 text-slate-400">XP</th>
                  <th className="pb-2 text-slate-400">Time</th>
                </tr></thead>
                <tbody>
                  {submissions.slice(0, 15).map((s, i) => (
                    <tr key={`${s.challengeId}-${i}`} className="border-b border-white/5">
                      <td className="py-2 pr-4">{s.userName}</td>
                      <td className="py-2 pr-4 text-slate-300">{s.challengeTitle || s.challengeId}</td>
                      <td className="py-2 pr-4"><span className={s.accuracy >= 80 ? "text-emerald-400" : s.accuracy >= 60 ? "text-amber-400" : "text-rose-400"}>{s.accuracy}%</span></td>
                      <td className="py-2 pr-4 text-brand-400">+{s.earnedXp}</td>
                      <td className="py-2 text-slate-400">{s.timeSpentMin}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {submissions.length === 0 && <p className="text-sm text-slate-400">No submissions yet. Complete challenges to see data here.</p>}
          </div>
        </div>
      )}

      {/* ═══ ADVANCED PANEL ═══ */}
      {tab === "advanced" && (
        <div className="space-y-6">
          {/* System Health */}
          {system ? (
            <div className="glass-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Database size={20} className="text-cyan-400" /> System Health</h2>
              <div className="grid gap-4 md:grid-cols-4">
                {[
                  { label: "Uptime", value: `${Math.round(system.uptime)}s`, color: "text-emerald-400" },
                  { label: "Heap Used", value: `${(system.memory.heapUsed / 1048576).toFixed(1)} MB`, color: "text-cyan-400" },
                  { label: "Database", value: system.db, color: system.db === "connected" ? "text-emerald-400" : "text-rose-400" },
                  { label: "Node", value: system.nodeVersion, color: "text-slate-300" }
                ].map((m) => (
                  <div key={m.label} className="rounded-xl bg-slate-900/40 p-4">
                    <div className="text-xs text-slate-400 mb-1">{m.label}</div>
                    <div className={`text-lg font-bold ${m.color}`}>{m.value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl bg-slate-900/40 p-3 text-sm"><span className="text-slate-400">Users:</span> <span className="font-medium">{system.userCount}</span></div>
                <div className="rounded-xl bg-slate-900/40 p-3 text-sm"><span className="text-slate-400">Challenges:</span> <span className="font-medium">{system.challengeCount}</span></div>
                <div className="rounded-xl bg-slate-900/40 p-3 text-sm"><span className="text-slate-400">Submissions:</span> <span className="font-medium">{system.submissionCount}</span></div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-sm text-slate-400">
              <Shield size={24} className="mx-auto mb-2 text-rose-400" />
              System metrics require super-admin access (superadmin@gamifyu.com / admin123)
            </div>
          )}

          {/* AI Difficulty Tuning */}
          {tuning ? (
            <div className="glass-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Sliders size={20} className="text-amber-400" /> AI Difficulty Tuning</h2>
              <div className="space-y-6">
                {[
                  { key: "easyThreshold", label: "Easy → Medium Threshold", desc: "Accuracy below this = easy difficulty", min: 30, max: 90 },
                  { key: "hardThreshold", label: "Medium → Hard Threshold", desc: "Accuracy above this = hard difficulty", min: 50, max: 100 },
                  { key: "streakBonusMultiplier", label: "Streak Bonus Multiplier", desc: "Base XP multiplier for streak bonuses", min: 1, max: 5 }
                ].map((s) => (
                  <div key={s.key}>
                    <div className="flex justify-between mb-1">
                      <div>
                        <div className="text-sm font-medium">{s.label}</div>
                        <div className="text-xs text-slate-400">{s.desc}</div>
                      </div>
                      <span className="text-brand-400 font-bold">{tuning[s.key]}</span>
                    </div>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.key === "streakBonusMultiplier" ? 0.25 : 5}
                      value={tuning[s.key]}
                      onChange={(e) => updateTuning(s.key, parseFloat(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none bg-slate-700 accent-brand-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 text-center text-sm text-slate-400">
              <Sliders size={24} className="mx-auto mb-2 text-rose-400" />
              AI tuning requires super-admin access
            </div>
          )}

          {/* Role Management */}
          <div className="glass-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Shield size={20} className="text-rose-400" /> Access Info</h2>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { role: "User", desc: "Student access. Dashboard, challenges, leaderboard, AI coach.", color: "border-emerald-500/30 bg-emerald-500/10" },
                { role: "Admin", desc: "Basic & Intermediate panel. Manage challenges, view analytics.", color: "border-amber-500/30 bg-amber-500/10" },
                { role: "Super Admin", desc: "Full system control. AI tuning, system health, role management.", color: "border-rose-500/30 bg-rose-500/10" }
              ].map((r) => (
                <div key={r.role} className={`rounded-xl border p-4 ${r.color}`}>
                  <div className="font-medium mb-1">{r.role}</div>
                  <div className="text-xs text-slate-400">{r.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
