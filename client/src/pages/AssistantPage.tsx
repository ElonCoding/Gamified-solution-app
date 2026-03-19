import { useState } from "react";
import api from "../api";

export default function AssistantPage() {
  const [input, setInput] = useState("How do I improve consistency this week?");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user" as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const response = await api.post("/api/assistant", { message: userMessage.text });
      setMessages((prev) => [...prev, { role: "assistant", text: response.data.reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-2">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-2 text-xl font-semibold">AI Learning Coach</div>
        <div className="text-sm text-slate-300">Personalized guidance based on your current growth metrics.</div>
      </div>
      <div className="h-[420px] space-y-3 overflow-auto rounded-2xl border border-white/10 bg-slate-900/50 p-4">
        {messages.length === 0 && <div className="text-sm text-slate-400">Ask your coach for challenge planning, revision loops, and streak optimization.</div>}
        {messages.map((m, i) => (
          <div key={`${m.role}-${i}`} className={`max-w-[85%] rounded-2xl p-3 text-sm ${m.role === "assistant" ? "bg-cyan-500/15 text-cyan-100" : "ml-auto bg-brand-600/60"}`}>
            {m.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3" placeholder="Message AI coach..." />
        <button disabled={loading} onClick={send} className="rounded-xl bg-brand-600 px-5 py-3">
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

