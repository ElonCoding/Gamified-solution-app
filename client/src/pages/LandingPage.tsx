import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Brain, Trophy } from "lucide-react";
import { useState } from "react";
import api, { setToken } from "../api";

type Props = {
  onAuth: (token: string) => void;
};

export default function LandingPage({ onAuth }: Props) {
  const [email, setEmail] = useState("student@demo.com");
  const [password, setPassword] = useState("student123");
  const [name, setName] = useState("Demo Student");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", { email, password });
      setToken(response.data.token);
      onAuth(response.data.token);
    } finally {
      setLoading(false);
    }
  };

  const register = async () => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/register", { name, email, password });
      setToken(response.data.token);
      onAuth(response.data.token);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 md:py-12">
      <section className="grid items-center gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2 md:p-10">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">
            <Sparkles size={14} />
            Production-ready prototype
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">
            Turn passive studying into <span className="bg-gradient-to-r from-brand-500 to-cyan-400 bg-clip-text text-transparent">daily momentum</span>
          </h1>
          <p className="mb-6 text-slate-300">
            GamifyU blends Duolingo loops, LeetCode skill growth, and a clean Notion-like workspace for undergraduate learning.
          </p>
          <div className="grid gap-3 text-sm text-slate-300">
            <div className="flex items-center gap-2"><Brain size={16} />Adaptive challenge difficulty</div>
            <div className="flex items-center gap-2"><Trophy size={16} />XP, coins, badges, leaderboard</div>
            <div className="flex items-center gap-2"><ShieldCheck size={16} />JWT-authenticated full-stack APIs</div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
          <h2 className="mb-4 text-xl font-semibold">Get started</h2>
          <div className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" placeholder="Name" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" placeholder="Password" />
            <button disabled={loading} onClick={login} className="w-full rounded-xl bg-brand-600 px-4 py-2 font-medium">
              Login Demo
            </button>
            <button disabled={loading} onClick={register} className="w-full rounded-xl border border-white/20 px-4 py-2">
              Register
            </button>
            <div className="flex items-center justify-center text-xs text-slate-400">
              Enter Dashboard <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

