const COLOR_MAP = {
  red: {
    stroke: '#EF4444',
    bg: 'bg-red-500/12 border-red-500/30',
    glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.55)]',
  },
  amber: {
    stroke: '#F59E0B',
    bg: 'bg-amber-500/12 border-amber-500/30',
    glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]',
  },
  green: {
    stroke: '#10B981',
    bg: 'bg-emerald-500/12 border-emerald-500/30',
    glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]',
  },
  cyan: {
    stroke: '#22D3EE',
    bg: 'bg-cyan-500/12 border-cyan-500/30',
    glow: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]',
  },
};

export default function WarningSymbol({ symbol, color = 'amber', size = 'md' }) {
  const palette = COLOR_MAP[color] || COLOR_MAP.amber;
  const boxSize = size === 'lg' ? 'h-16 w-16 rounded-2xl' : 'h-12 w-12 rounded-xl';
  const svgSize = size === 'lg' ? 'h-9 w-9' : 'h-7 w-7';

  return (
    <div
      className={`flex shrink-0 items-center justify-center border ${palette.bg} ${boxSize}`}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke={palette.stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${svgSize} ${palette.glow}`}
        aria-hidden="true"
      >
        {symbol === 'check-engine' && (
          <>
            <path d="M16 14H28M22 14V18" />
            <path d="M12 20H16L19 18H31L34 21H38V33H34L31 36H17L14 32H12V20Z" />
            <path d="M8 22V30M8 26H12M38 24H41V30H38" />
          </>
        )}

        {symbol === 'oil-pressure' && (
          <>
            <path d="M10 26L15 22H26L33 25L40 21L38 25L31 32H14L10 26Z" />
            <path d="M10 26L7 23M18 18H24M21 18V22" />
            <path d="M40 29C40 31.2 38.5 33 38.5 33C38.5 33 37 31.2 37 29C37 27.6 38.5 26 38.5 26C38.5 26 40 27.6 40 29Z" fill={palette.stroke} />
          </>
        )}

        {symbol === 'coolant-temp' && (
          <>
            <path d="M24 10V29" />
            <circle cx="24" cy="31" r="3" fill={palette.stroke} />
            <path d="M24 14H30M24 19H30M24 24H30" />
            <path d="M10 35C12.5 33.5 15 33.5 17.5 35C20 36.5 22.5 36.5 25 35C27.5 33.5 30 33.5 32.5 35C35 36.5 37.5 36.5 39 35" />
            <path d="M12 39C14.5 37.5 17 37.5 19.5 39C22 40.5 24.5 40.5 27 39C29.5 37.5 32 37.5 34.5 39" />
          </>
        )}

        {symbol === 'brake-system' && (
          <>
            <circle cx="24" cy="24" r="11" />
            <path d="M24 18V25" strokeWidth="2.8" />
            <circle cx="24" cy="29.5" r="1.2" fill={palette.stroke} />
            <path d="M10 15C7.5 18 7.5 30 10 33" />
            <path d="M38 15C40.5 18 40.5 30 38 33" />
          </>
        )}

        {symbol === 'abs' && (
          <>
            <circle cx="24" cy="24" r="12" />
            <path d="M9 15C6.5 18.5 6.5 29.5 9 33" />
            <path d="M39 15C41.5 18.5 41.5 29.5 39 33" />
            <text
              x="24"
              y="27.5"
              textAnchor="middle"
              fill={palette.stroke}
              stroke="none"
              fontSize="9.5"
              fontWeight="800"
              fontFamily="Inter, sans-serif"
            >
              ABS
            </text>
          </>
        )}

        {symbol === 'battery' && (
          <>
            <rect x="9" y="16" width="30" height="20" rx="3" />
            <path d="M14 16V13H19V16M29 16V13H34V16" />
            <path d="M14 26H19M31.5 23.5V28.5M29 26H34" />
          </>
        )}

        {symbol === 'tpms' && (
          <>
            <path d="M14 14C10.5 18.5 10.5 27.5 15 33H33C37.5 27.5 37.5 18.5 34 14" />
            <path d="M17 36H31M19 33V36M24 33V36M29 33V36" />
            <path d="M24 18V25" strokeWidth="2.8" />
            <circle cx="24" cy="29" r="1.2" fill={palette.stroke} />
          </>
        )}

        {symbol === 'airbag' && (
          <>
            <circle cx="29" cy="14" r="3" />
            <path d="M28 19L23 29H15L12 36" />
            <path d="M26 24L20 26" />
            <circle cx="17" cy="18" r="5" />
          </>
        )}

        {symbol === 'esc' && (
          <>
            <path d="M15 21L18 14H30L33 21H36V26H12V21H15Z" />
            <path d="M15 26V29M33 26V29" />
            <path d="M17 32C15 34 19 36 17 39" />
            <path d="M31 32C29 34 33 36 31 39" />
          </>
        )}

        {symbol === 'steering' && (
          <>
            <circle cx="21" cy="24" r="11" />
            <circle cx="21" cy="24" r="2.5" />
            <path d="M11 22H31M21 26.5V35" />
            <path d="M37 17V25" strokeWidth="2.6" />
            <circle cx="37" cy="29.5" r="1.2" fill={palette.stroke} />
          </>
        )}

        {symbol === 'ev-ready' && (
          <>
            <path d="M12 24L16 16H32L36 24H39V30H9V24H12Z" />
            <circle cx="16" cy="30" r="2.5" />
            <circle cx="32" cy="30" r="2.5" />
            <path d="M25 18L21 24H25L23 28" />
          </>
        )}

        {symbol === 'adas' && (
          <>
            <path d="M17 20L19 14H29L31 20H33V24H15V20H17Z" />
            <path d="M18 29C21 31.5 27 31.5 30 29" />
            <path d="M14 34C19.5 38 28.5 38 34 34" />
            <path d="M10 11L14 14M38 11L34 14" />
          </>
        )}
      </svg>
    </div>
  );
}
