import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
};

export default function StatCard({ label, value, hint, icon }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-glow"
    >
      <div className="mb-2 flex items-center justify-between text-slate-300">
        <span className="text-sm">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {hint && <div className="mt-2 text-xs text-slate-400">{hint}</div>}
    </motion.div>
  );
}

