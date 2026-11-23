import { useEffect, useState } from 'react';
import { motion, animate, useReducedMotion } from 'framer-motion';

function AnimatedNumber({ value, suffix = '', prefix = '' }) {
  const prefersReduced = useReducedMotion();
  const isNumeric = typeof value === 'number' && !Number.isNaN(value);
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (!isNumeric || prefersReduced) return undefined;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setAnimatedValue(Number.isInteger(value) ? Math.round(latest) : Number(latest.toFixed(1)));
      },
    });
    return () => controls.stop();
  }, [value, isNumeric, prefersReduced]);

  const shown = !isNumeric || prefersReduced ? value : animatedValue;

  return (
    <span>
      {prefix}
      {isNumeric ? shown.toLocaleString() : shown}
      {suffix}
    </span>
  );
}

const ACCENT_MAP = {
  blue: 'bg-[#3B82F6]/15 text-[#3B82F6] border-[#3B82F6]/30',
  cyan: 'bg-[#22D3EE]/15 text-[#22D3EE] border-[#22D3EE]/30',
  green: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  red: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  trend,
  trendPositive = true,
  icon: Icon,
  accent = 'blue',
  sublabel,
  className = '',
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-[#263449] bg-[#172338] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-colors duration-200 hover:border-[#3B82F6]/45 ${className}`}
    >
      {/* Subtle top blue sheen on hover */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#3B82F6]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">{label}</p>
          <p className="mt-2.5 text-3xl font-bold tracking-tight text-white">
            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          </p>
        </div>
        {Icon && (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
              ACCENT_MAP[accent] || ACCENT_MAP.blue
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {(trend || sublabel) && (
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#263449]/70 pt-3 text-xs">
          {trend && (
            <span
              className={`font-medium ${
                trendPositive ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {trend}
            </span>
          )}
          {sublabel && <span className="text-[#94A3B8]">{sublabel}</span>}
        </div>
      )}
    </motion.div>
  );
}
