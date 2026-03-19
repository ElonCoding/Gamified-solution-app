import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Particle = { id: number; x: number; y: number; color: string; size: number; rotation: number };

const COLORS = ["#7c3aed", "#06b6d4", "#f59e0b", "#f43f5e", "#10b981", "#3b82f6", "#ec4899", "#8b5cf6"];

type Props = {
  show: boolean;
  onDone?: () => void;
  message?: string;
};

export default function Confetti({ show, onDone, message }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!show) { setParticles([]); return; }
    const items: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -(Math.random() * 20),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360
    }));
    setParticles(items);
    const timer = setTimeout(() => { setParticles([]); onDone?.(); }, 3000);
    return () => clearTimeout(timer);
  }, [show, onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: `${p.x}vw`, y: "-5vh", rotate: 0, opacity: 1 }}
              animate={{
                y: "105vh",
                rotate: p.rotation + 720,
                opacity: [1, 1, 0.8, 0]
              }}
              transition={{ duration: 2 + Math.random() * 1.5, ease: "easeIn" }}
              className="absolute rounded-sm"
              style={{ width: p.size, height: p.size, backgroundColor: p.color }}
            />
          ))}
          {message && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="rounded-2xl border border-brand-500/30 bg-slate-900/90 px-8 py-6 text-center shadow-glow-brand backdrop-blur-lg">
                <div className="mb-2 text-4xl">🎉</div>
                <div className="text-xl font-bold gradient-text">{message}</div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
