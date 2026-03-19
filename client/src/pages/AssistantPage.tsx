import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";
import api from "../api";

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "How can I improve my consistency?",
    "What challenges should I do today?",
    "Tell me about my badges",
    "How do streaks work?"
  ];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const send = async (msg?: string) => {
    const text = msg || input;
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/api/assistant", { message: text });
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I couldn't process that. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex flex-col gap-4 py-2" style={{ height: "calc(100vh - 180px)" }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Bot size={24} className="text-brand-400" /> AI Learning Coach
        </h1>
        <p className="mt-1 text-sm text-slate-400">Personalized guidance based on your growth metrics</p>
      </motion.div>

      {/* Chat Area */}
      <div ref={chatRef} className="flex-1 space-y-3 overflow-auto rounded-2xl border border-white/10 bg-slate-900/50 p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <Sparkles size={40} className="text-brand-400 animate-pulse" />
            <p className="text-sm text-slate-400 text-center">Ask your AI coach for challenge planning, revision loops, and streak optimization.</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 transition hover:border-brand-500/30 hover:bg-brand-500/10"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={`${m.role}-${i}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-500/20">
                  <Bot size={16} className="text-brand-400" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "assistant" ? "bg-white/5 border border-white/10" : "bg-gradient-to-r from-brand-600 to-brand-500 text-white"}`}>
                {m.text}
              </div>
              {m.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600">
                  <User size={16} className="text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500/20">
              <Bot size={16} className="text-brand-400" />
            </div>
            <div className="flex gap-1.5 rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: "0s" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: "0.15s" }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-brand-400" style={{ animationDelay: "0.3s" }} />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          placeholder="Message AI coach..."
        />
        <button disabled={loading || !input.trim()} onClick={() => send()} className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-3 transition hover:shadow-glow-brand disabled:opacity-50">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
