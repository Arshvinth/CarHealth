export const BRAND = {
  name: 'CarHealth',
  tagline: 'Understand Your Vehicle. Drive With Confidence.',
  shortTagline: 'Intelligent Vehicle Diagnostics & Telemetry',
};

export const COLORS = {
  bgPrimary: '#0B1220',
  bgSecondary: '#111C2E',
  bgCard: '#172338',
  bgCardHover: '#1C2B45',
  accentBlue: '#3B82F6',
  accentCyan: '#22D3EE',
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  border: '#263449',
  status: {
    critical: '#EF4444',
    moderate: '#F59E0B',
    healthy: '#10B981',
  },
};

export const SEVERITY_STYLES = {
  critical: {
    label: 'Critical',
    dot: 'bg-red-500',
    badge: 'bg-red-500/15 text-red-400 border-red-500/30',
    accentBorder: 'border-red-500/30',
    text: 'text-red-400',
    bar: 'bg-red-500',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.18)]',
  },
  high: {
    label: 'High',
    dot: 'bg-orange-400',
    badge: 'bg-orange-500/15 text-orange-300 border-orange-500/35',
    accentBorder: 'border-orange-500/35',
    text: 'text-orange-400',
    bar: 'bg-orange-400',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.18)]',
  },
  moderate: {
    label: 'Moderate',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    accentBorder: 'border-amber-500/30',
    text: 'text-amber-400',
    bar: 'bg-amber-400',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.16)]',
  },
  warning: {
    label: 'Moderate',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    accentBorder: 'border-amber-500/30',
    text: 'text-amber-400',
    bar: 'bg-amber-400',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.16)]',
  },
  low: {
    label: 'Low',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    accentBorder: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bar: 'bg-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.16)]',
  },
  healthy: {
    label: 'Healthy',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    accentBorder: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bar: 'bg-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.16)]',
  },
  resolved: {
    label: 'Resolved',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    accentBorder: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bar: 'bg-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(16,185,129,0.16)]',
  },
};

export const MOTION = {
  easeOutExpo: [0.16, 1, 0.3, 1],
  springSnappy: { type: 'spring', stiffness: 360, damping: 30 },
  pageVariants: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: 'easeIn' } },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
    }),
  },
};
