import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Award, Lock, Unlock, Shield, Star, TrendingUp } from "lucide-react";
import api from "../api";
import type { ProfilePayload, SkillTree } from "../types";
import ProgressRing from "../components/ProgressRing";

export default function ProfilePage() {
  const [data, setData] = useState<ProfilePayload | null>(null);
  const [skillTree, setSkillTree] = useState<SkillTree | null>(null);

  useEffect(() => {
    Promise.all([api.get("/api/profile"), api.get("/api/skill-tree")]).then(([p, s]) => {
      setData(p.data);
      setSkillTree(s.data.skillTree);
    });
  }, []);

  if (!data) return <div className="flex min-h-[60vh] items-center justify-center animate-pulse text-slate-400">Loading profile...</div>;

  const { user, allBadges, levelInfo, proficiency, weeklyStats } = data;

  return (
    <div className="space-y-6 py-2">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-cyan-400 text-3xl font-bold text-white shadow-glow-brand">
              {user.name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-brand-600 p-1.5 text-xs">
              {levelInfo.current.icon}
            </div>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-slate-400">{user.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <span className="flex items-center gap-1 text-sm"><Star size={14} className="text-brand-400" />{user.xp.toLocaleString()} XP</span>
              <span className="flex items-center gap-1 text-sm"><Shield size={14} className="text-cyan-400" />{user.level}</span>
              <span className="flex items-center gap-1 text-sm"><TrendingUp size={14} className="text-amber-400" />{user.totalChallengesCompleted || 0} challenges</span>
            </div>
          </div>
          <div className="ml-auto">
            <ProgressRing value={levelInfo.progress} size={80} color="#7c3aed" label={`${levelInfo.progress}%`} sublabel="to next" />
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Award size={20} className="text-amber-400" /> Achievements</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {allBadges.map((badge, i) => {
            const earned = user.badges.includes(badge.name);
            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex flex-col items-center rounded-xl border p-4 text-center transition ${earned ? "border-amber-400/30 bg-amber-500/10 shadow-glow-sm" : "border-white/10 bg-white/5 opacity-50"}`}
              >
                <span className="mb-2 text-2xl">{badge.icon}</span>
                <span className="text-xs font-medium">{badge.name}</span>
                <span className="mt-1 text-[10px] text-slate-400">{badge.description}</span>
                {earned ? <span className="mt-1 text-[10px] text-emerald-400">✓ Earned</span> : <span className="mt-1 text-[10px] text-slate-500">🔒 Locked</span>}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Skill Tree */}
      {skillTree && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h2 className="mb-4 text-lg font-semibold flex items-center gap-2"><User size={20} className="text-cyan-400" /> Skill Tree</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {Object.entries(skillTree).map(([key, branch]) => (
              <div key={key} className="rounded-xl border border-white/10 bg-slate-900/40 p-4">
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <span className="text-lg">{branch.icon}</span> {branch.name}
                </h3>
                <div className="space-y-2">
                  {branch.nodes.map((node, ni) => (
                    <div key={node.id} className={`flex items-center gap-3 rounded-lg p-2 transition ${node.unlocked ? "bg-brand-500/10" : "bg-white/5 opacity-60"}`}>
                      <span className="text-sm">{node.unlocked ? <Unlock size={14} className="text-emerald-400" /> : <Lock size={14} className="text-slate-500" />}</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{node.name}</div>
                        <div className="mt-1 h-1.5 rounded-full bg-slate-800">
                          <div className={`h-full rounded-full transition-all ${node.unlocked ? "bg-emerald-400" : "bg-slate-600"}`} style={{ width: `${node.progress}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{node.requiredXp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass-card p-6">
          <h3 className="mb-3 font-semibold">Proficiency</h3>
          {Object.entries(proficiency).map(([k, v]) => (
            <div key={k} className="mb-3">
              <div className="flex justify-between text-sm"><span className="capitalize">{k === "softSkills" ? "Soft Skills" : k}</span><span className="text-brand-400">{v}%</span></div>
              <div className="mt-1 h-2 rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-400" style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card p-6">
          <h3 className="mb-3 font-semibold">Weekly Performance</h3>
          {Object.entries(weeklyStats).map(([k, v]) => (
            <div key={k} className="mb-3">
              <div className="flex justify-between text-sm"><span className="capitalize">{k}</span><span className="text-cyan-400">{v}%</span></div>
              <div className="mt-1 h-2 rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${v}%` }} /></div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
