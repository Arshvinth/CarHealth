import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Clock, Wrench } from 'lucide-react';
import SeverityBadge from './SeverityBadge';

export default function DiagnosticCard({ diagnostic, onSelect, className = '' }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect?.(diagnostic)}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(e) => {
        if (onSelect && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(diagnostic);
        }
      }}
      className={`group flex flex-col justify-between rounded-2xl border border-[#263449] bg-[#172338] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-all duration-200 hover:border-[#3B82F6]/55 hover:bg-[#1C2B45]/90 ${
        onSelect ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]' : ''
      } ${className}`}
    >
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="rounded-lg border border-[#3B82F6]/35 bg-[#3B82F6]/12 px-2.5 py-1 font-mono text-sm font-semibold tracking-wider text-[#22D3EE]">
              {diagnostic.code}
            </span>
            <SeverityBadge
              severity={diagnostic.status === 'resolved' ? 'resolved' : diagnostic.severity}
              pulse={diagnostic.severity === 'critical' && diagnostic.status === 'active'}
            />
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-[#94A3B8]">
            <Clock className="h-3.5 w-3.5" />
            {diagnostic.detectedAt}
          </span>
        </div>

        <h3 className="mt-3.5 text-base font-semibold text-white transition-colors group-hover:text-[#60A5FA]">
          {diagnostic.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[#94A3B8]">
          {diagnostic.summary}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#263449]/75 pt-3.5 text-xs">
        <div className="flex flex-wrap items-center gap-3 text-[#94A3B8]">
          <span className="inline-flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-[#3B82F6]" />
            {diagnostic.system}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5 text-[#22D3EE]" />
            {diagnostic.estimatedCost}
          </span>
        </div>

        {onSelect && (
          <span className="inline-flex items-center gap-1 font-medium text-[#3B82F6] transition-transform group-hover:translate-x-0.5 group-hover:text-[#22D3EE]">
            Full Report
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </motion.div>
  );
}
