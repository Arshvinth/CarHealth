import { motion } from 'framer-motion';
import { Wrench, CheckCircle2, Info } from 'lucide-react';

const LIKELIHOOD_STYLES = {
  'Most Likely': 'border-[#3B82F6]/45 bg-[#3B82F6]/15 text-[#60A5FA]',
  Likely: 'border-[#22D3EE]/40 bg-[#22D3EE]/12 text-[#22D3EE]',
  Possible: 'border-amber-500/35 bg-amber-500/12 text-amber-300',
  'Less Likely': 'border-[#263449] bg-[#111C2E] text-[#94A3B8]',
};

export default function PossibleCauseCard({ cause, index = 0 }) {
  const rank = cause.rank || index + 1;
  const likelihoodStyle =
    LIKELIHOOD_STYLES[cause.likelihood] || LIKELIHOOD_STYLES.Possible;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="rounded-2xl border border-[#263449] bg-[#172338] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-colors hover:border-[#3B82F6]/45"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#3B82F6]/40 bg-[#3B82F6]/15 font-mono text-sm font-bold text-[#22D3EE]">
            #{rank}
          </span>
          <h3 className="text-base font-semibold text-white">{cause.componentName}</h3>
        </div>

        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${likelihoodStyle}`}
        >
          {cause.likelihood}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[#E2E8F0]">{cause.explanation}</p>

      {/* Why this component matches */}
      <div className="mt-3.5 rounded-xl border border-[#263449]/75 bg-[#111C2E]/85 p-3.5">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE]">
          <Info className="h-3.5 w-3.5" />
          Why this component may cause your reported symptoms
        </p>
        <p className="mt-1 text-xs leading-relaxed text-[#94A3B8]">{cause.whyItMatches}</p>
      </div>

      {/* Supporting Symptoms */}
      {cause.supportingSymptoms?.length > 0 && (
        <div className="mt-3.5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            Supporting Symptoms to Watch For
          </p>
          <div className="flex flex-wrap gap-2">
            {cause.supportingSymptoms.map((sym) => (
              <span
                key={sym}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#0B1220]/75 px-2.5 py-1 text-xs text-[#E2E8F0]"
              >
                <CheckCircle2 className="h-3 w-3 shrink-0 text-[#3B82F6]" />
                {sym}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Inspection */}
      <div className="mt-4 flex items-start gap-2.5 border-t border-[#263449]/75 pt-3.5 text-xs">
        <Wrench className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
        <div>
          <span className="font-semibold text-white">Recommended Inspection: </span>
          <span className="text-[#94A3B8]">{cause.recommendedInspection}</span>
        </div>
      </div>
    </motion.article>
  );
}
