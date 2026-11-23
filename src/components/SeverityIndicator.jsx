import { ShieldAlert, AlertTriangle, AlertCircle, CheckCircle2, OctagonAlert } from 'lucide-react';

const SEVERITY_CONFIG = {
  Critical: {
    bars: 4,
    barColor: 'bg-red-500',
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
    badge: 'bg-red-500/20 text-red-300 border-red-500/40',
    iconColor: 'text-red-400',
    Icon: OctagonAlert,
  },
  High: {
    bars: 3,
    barColor: 'bg-orange-400',
    border: 'border-orange-500/40',
    bg: 'bg-orange-500/10',
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    iconColor: 'text-orange-400',
    Icon: ShieldAlert,
  },
  Moderate: {
    bars: 2,
    barColor: 'bg-amber-400',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    iconColor: 'text-amber-400',
    Icon: AlertTriangle,
  },
  Low: {
    bars: 1,
    barColor: 'bg-emerald-400',
    border: 'border-emerald-500/35',
    bg: 'bg-emerald-500/10',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35',
    iconColor: 'text-emerald-400',
    Icon: CheckCircle2,
  },
};

export default function SeverityIndicator({
  level = 'Moderate',
  reasoning,
  drivingRecommendation,
  drivingDetails,
  compact = false,
}) {
  const cfg = SEVERITY_CONFIG[level] || SEVERITY_CONFIG.Moderate;
  const Icon = cfg.Icon || AlertCircle;

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {level}
      </span>
    );
  }

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${cfg.border} ${cfg.bg}`}>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Severity Assessment */}
        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.badge}`}
            >
              <Icon className="h-4 w-4" />
              {level} Severity
            </span>

            {/* 4-segment automotive severity meter */}
            <div className="flex items-center gap-1" aria-label={`Severity ${cfg.bars} of 4`}>
              {[1, 2, 3, 4].map((step) => (
                <span
                  key={step}
                  className={`h-2 w-6 rounded-full ${
                    step <= cfg.bars ? cfg.barColor : 'bg-[#0B1220]/75'
                  }`}
                />
              ))}
            </div>
          </div>

          {reasoning && (
            <p className="mt-3 text-sm leading-relaxed text-[#E2E8F0]">{reasoning}</p>
          )}
        </div>

        {/* Driving Recommendation */}
        {drivingRecommendation && (
          <div className="rounded-xl border border-[#263449] bg-[#0B1220]/80 p-4 lg:col-span-6">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#94A3B8]">
              Driving Recommendation
            </p>
            <p className={`mt-1.5 text-base font-bold ${cfg.iconColor}`}>
              {drivingRecommendation}
            </p>
            {drivingDetails && (
              <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">{drivingDetails}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
