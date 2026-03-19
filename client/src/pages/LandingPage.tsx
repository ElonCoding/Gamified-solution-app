import { motion } from "framer-motion";
import { ArrowRight, Rocket, Trophy, Brain, Flame, Shield, Sparkles, Zap, BarChart3, Bot } from "lucide-react";
import { useState } from "react";
import api, { setToken } from "../api";

type Props = { onAuth: (token: string) => void };

const features = [
  { icon: Rocket, title: "XP & Leveling", desc: "Earn XP for every task. Progress from Beginner to Master.", color: "text-brand-400" },
  { icon: Flame, title: "Daily Streaks", desc: "Build momentum with streak multipliers up to 2x.", color: "text-orange-400" },
  { icon: Trophy, title: "Leaderboards", desc: "Compete globally. Climb the ranks. Earn badges.", color: "text-amber-400" },
  { icon: Brain, title: "Adaptive AI", desc: "Challenge difficulty scales with your skill level.", color: "text-cyan-400" },
  { icon: BarChart3, title: "Analytics", desc: "Track accuracy, speed, consistency, and growth.", color: "text-emerald-400" },
  { icon: Bot, title: "AI Coach", desc: "Personalized recommendations and learning paths.", color: "text-purple-400" }
];

export default function LandingPage({ onAuth }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("student@demo.com");
  const [password, setPassword] = useState("student123");
  const [name, setName] = useState("Demo Student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = mode === "login" ? { email, password } : { name, email, password };
      const response = await api.post(endpoint, body);
      setToken(response.data.token);
      onAuth(response.data.token);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 md:py-10">
      {/* Hero */}
      <section className="mb-12 grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm text-brand-400">
            <Sparkles size={14} className="animate-pulse" />
            Production-Ready Gamified Learning
          </div>
          <h1 className="mb-5 text-4xl font-extrabold leading-tight md:text-5xl lg:text-6xl">
            Turn passive studying into{" "}
            <span className="gradient-text animate-gradient bg-gradient-to-r from-brand-500 via-cyan-400 to-blue-500">
              daily momentum
            </span>
          </h1>
          <p className="mb-8 text-lg text-slate-300 leading-relaxed">
            GamifyU blends Duolingo engagement loops, LeetCode skill-building, and Notion-clean workspaces into one platform for undergraduate excellence.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { icon: Shield, text: "JWT-Secured APIs" },
              { icon: Zap, text: "Real-time Updates" },
              { icon: Brain, text: "AI-Adaptive Difficulty" },
              { icon: Trophy, text: "XP, Coins & Badges" }
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-slate-300">
                <Icon size={16} className="text-brand-400" />
                {text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Auth Card */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="glass-card p-6 md:p-8 shadow-glow">
            <div className="mb-6 flex gap-2 rounded-xl bg-white/5 p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === "login" ? "bg-brand-600 text-white shadow-glow-sm" : "text-slate-300 hover:text-white"}`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${mode === "register" ? "bg-brand-600 text-white shadow-glow-sm" : "text-slate-300 hover:text-white"}`}
              >
                Register
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="Full Name" />
              )}
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="Email" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500" placeholder="Password" />
              {error && <div className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm text-rose-400">{error}</div>}
              <button disabled={loading} className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-3 font-medium text-white shadow-glow-sm transition hover:shadow-glow-brand disabled:opacity-60">
                {loading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">{mode === "login" ? "Login" : "Create Account"} <ArrowRight size={16} /></span>
                )}
              </button>
            </form>
            <div className="mt-4 text-center text-xs text-slate-400">
              Demo: student@demo.com / student123
              <br />
              Admin: admin@gamifyu.com / admin123
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold">Everything You Need to Level Up</h2>
          <p className="text-slate-400">A proven gamification stack for measurable skill growth</p>
        </motion.div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass-card p-5 transition-shadow hover:shadow-glow"
            >
              <f.icon size={24} className={`mb-3 ${f.color}`} />
              <h3 className="mb-1 font-semibold">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
