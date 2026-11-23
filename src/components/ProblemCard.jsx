import { motion } from 'framer-motion';
import {
  Thermometer,
  PowerOff,
  Disc,
  RotateCw,
  Activity,
  BatteryWarning,
  Fuel,
  Wind,
  AlertOctagon,
  Compass,
  Zap,
  BatteryCharging,
  ArrowRight,
} from 'lucide-react';
import SeverityIndicator from './SeverityIndicator';

const PROBLEM_ICONS = {
  Thermometer,
  PowerOff,
  Disc,
  RotateCw,
  Activity,
  BatteryWarning,
  Fuel,
  Wind,
  AlertOctagon,
  Compass,
  Zap,
  BatteryCharging,
};

export default function ProblemCard({ problem, onSelect }) {
  const Icon = PROBLEM_ICONS[problem.icon] || Activity;

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect?.(problem)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(problem);
        }
      }}
      className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#263449] bg-[#172338] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-all duration-200 hover:border-[#3B82F6]/55 hover:bg-[#1C2B45] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE]"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#263449] bg-[#111C2E] text-[#22D3EE] transition-colors group-hover:border-[#3B82F6]/50 group-hover:text-white group-hover:bg-[#3B82F6]">
            <Icon className="h-5 w-5" />
          </div>
          <SeverityIndicator level={problem.severity} compact />
        </div>

        <h3 className="mt-4 text-base font-semibold text-white transition-colors group-hover:text-[#60A5FA]">
          {problem.title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">{problem.shortDescription}</p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#263449]/75 pt-3.5 text-xs">
        <span className="font-mono text-[11px] uppercase text-[#94A3B8]">
          {problem.recommendedVehicleType}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#3B82F6] transition-transform group-hover:translate-x-0.5 group-hover:text-[#22D3EE]">
          View Details
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </motion.article>
  );
}
