import React from 'react';

const FINISH_PALETTES = {
  sapphire: {
    bodyTop: '#243B61',
    bodyMid: '#152540',
    bodyBottom: '#0B1324',
    accentLine: '#3B82F6',
    highlight: '#60A5FA',
    caliper: '#3B82F6',
  },
  titanium: {
    bodyTop: '#3B4A62',
    bodyMid: '#232F44',
    bodyBottom: '#101827',
    accentLine: '#22D3EE',
    highlight: '#94A3B8',
    caliper: '#22D3EE',
  },
  obsidian: {
    bodyTop: '#263247',
    bodyMid: '#172030',
    bodyBottom: '#0A0F1A',
    accentLine: '#3B82F6',
    highlight: '#64748B',
    caliper: '#EF4444',
  },
};

function AlloyWheel({ cx, cy, r = 52, spinning = true, speed = '1.4s', caliperColor = '#3B82F6', idPrefix }) {
  const spokes = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];

  return (
    <g transform={`translate(${cx}, ${cy})`}>
      {/* Dark wheel well depth behind wheel */}
      <circle cx="0" cy="0" r={r + 8} fill="#060A13" />

      {/* Stationary drilled brake rotor & performance caliper (visible through spokes) */}
      <g opacity="0.92">
        <circle cx="0" cy="0" r={r * 0.62} fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
        <circle cx="0" cy="0" r={r * 0.45} fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="3 4" />
        {/* Stationary caliper mounted at 10 o'clock */}
        <path
          d={`M ${-r * 0.56} ${-r * 0.24} A ${r * 0.6} ${r * 0.6} 0 0 1 ${-r * 0.18} ${-r * 0.58} L ${-r * 0.1} ${-r * 0.42} A ${r * 0.44} ${r * 0.44} 0 0 0 ${-r * 0.4} ${-r * 0.16} Z`}
          fill={caliperColor}
          opacity="0.95"
        />
      </g>

      {/* Independently rotating wheel & alloy rim anchored strictly at (0,0) */}
      <g
        className={`ch-wheel-rotate ${spinning ? '' : 'ch-wheel-paused'}`}
        style={{ '--wheel-speed': speed }}
      >
        {/* Tire outer rubber */}
        <circle cx="0" cy="0" r={r} fill="none" stroke="#0C121E" strokeWidth="13" />
        <circle cx="0" cy="0" r={r - 1} fill="none" stroke="#1E293B" strokeWidth="1.5" />
        {/* Subtle rotating tire tread / sidewall marks so motion feels authentic */}
        <circle
          cx="0"
          cy="0"
          r={r - 3.5}
          fill="none"
          stroke="#334155"
          strokeWidth="2.5"
          strokeDasharray="10 18"
          opacity="0.7"
        />

        {/* Metallic alloy barrel lip */}
        <circle
          cx="0"
          cy="0"
          r={r - 11}
          fill="none"
          stroke={`url(#${idPrefix}-rim)`}
          strokeWidth="4"
        />
        <circle
          cx="0"
          cy="0"
          r={r - 14}
          fill="none"
          stroke="#22D3EE"
          strokeWidth="0.9"
          opacity="0.55"
        />

        {/* Precision 10-spoke turbine alloy wheel */}
        {spokes.map((angle, idx) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <path
              d={
                idx % 2 === 0
                  ? `M -2.6 -10 L -5.2 ${-(r - 13)} L 1.2 ${-(r - 13)} L 2.2 -10 Z`
                  : `M -1.4 -11 L -2.8 ${-(r - 14)} L 2.4 ${-(r - 14)} L 1.8 -11 Z`
              }
              fill={idx % 2 === 0 ? `url(#${idPrefix}-spoke)` : '#475569'}
            />
          </g>
        ))}

        {/* Lug bolts ring */}
        <circle cx="0" cy="0" r="12.5" fill="#0F172A" stroke="#64748B" strokeWidth="1.8" />
        {[0, 72, 144, 216, 288].map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <circle
              key={a}
              cx={Math.cos(rad) * 7.5}
              cy={Math.sin(rad) * 7.5}
              r="1.7"
              fill="#CBD5E1"
            />
          );
        })}

        {/* Center cap with CarHealth cyan/blue accent */}
        <circle cx="0" cy="0" r="4.5" fill="#172338" stroke="#3B82F6" strokeWidth="1.4" />
        <circle cx="0" cy="0" r="1.6" fill="#22D3EE" />
      </g>

      {/* Stationary top rim specular reflection over spinning wheel */}
      <path
        d={`M ${-r * 0.65} ${-r * 0.55} A ${r * 0.85} ${r * 0.85} 0 0 1 ${r * 0.65} ${-r * 0.55}`}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.22"
      />
    </g>
  );
}

/**
 * High-precision layered automotive vehicle visual with:
 * - Independently spinning front & rear alloy wheels around exact wheel centers
 * - Stationary sculpted metallic vehicle body & glowing LED lighting
 * - Optional horizontal blue/cyan diagnostic scanning beam & telemetry pins
 * - Optional aerodynamic light trails
 */
export default function CarShowcase({
  variant = 'coupe',
  finish = 'sapphire',
  spinning = true,
  wheelSpeed = '1.35s',
  showScan = true,
  showLightTrails = true,
  showTelemetryNodes = false,
  className = '',
}) {
  const palette = FINISH_PALETTES[finish] || FINISH_PALETTES.sapphire;
  const uid = React.useId().replace(/:/g, '');

  // Subtle silhouette geometry variations for coupe / sedan / suv
  const isSuv = variant === 'suv';
  const isSedan = variant === 'sedan';

  const bodyPath = isSuv
    ? 'M 92 222 L 106 164 C 118 148 158 142 212 138 L 298 86 C 340 66 438 64 568 72 C 620 76 664 96 694 134 L 748 144 C 770 150 784 166 786 196 L 784 226 C 782 238 770 244 754 244 L 680 244 C 676 190 626 160 582 178 C 556 189 544 214 542 244 L 288 244 C 284 190 234 160 190 178 C 164 189 152 214 150 244 L 114 244 C 98 244 90 234 92 222 Z'
    : isSedan
    ? 'M 86 226 L 106 174 C 122 156 172 146 236 142 L 324 94 C 366 74 452 74 532 86 C 584 96 626 118 660 144 L 746 154 C 770 160 786 176 788 202 L 784 228 C 782 238 770 244 752 244 L 680 244 C 674 192 624 162 582 180 C 558 190 546 214 544 244 L 288 244 C 282 192 232 162 190 180 C 166 190 154 214 152 244 L 112 244 C 94 244 84 236 86 226 Z'
    : 'M 78 228 L 102 182 C 124 160 180 148 250 142 L 348 92 C 394 72 478 72 560 88 C 618 100 666 126 708 148 L 758 158 C 778 164 790 180 792 204 L 788 228 C 784 238 772 244 752 244 L 682 244 C 676 190 626 160 582 178 C 556 189 544 214 542 244 L 290 244 C 284 190 234 160 190 178 C 164 189 152 214 150 244 L 108 244 C 90 244 76 238 78 228 Z';

  const cabinPath = isSuv
    ? 'M 250 138 L 314 96 C 350 78 438 77 554 84 C 600 88 634 106 658 134 Z'
    : isSedan
    ? 'M 268 140 L 336 102 C 374 84 452 84 522 96 C 566 104 600 122 626 142 Z'
    : 'M 284 140 L 360 100 C 402 82 478 82 548 96 C 594 106 630 124 660 144 Z';

  const frontWheelX = 219;
  const rearWheelX = 611;
  const wheelY = 236;
  const wheelR = isSuv ? 55 : 52;

  return (
    <div className={`relative w-full select-none overflow-hidden ${className}`}>
      {/* Ambient blue/cyan studio floor glow */}
      <div
        className="pointer-events-none absolute inset-x-10 bottom-4 h-16 rounded-full blur-3xl ch-ambient-glow"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(59,130,246,0.34) 0%, rgba(34,211,238,0.16) 45%, transparent 75%)',
        }}
      />

      <svg
        viewBox="0 0 880 320"
        className="relative z-10 h-auto w-full drop-shadow-[0_24px_38px_rgba(0,0,0,0.65)]"
        role="img"
        aria-label="CarHealth precision automotive vehicle showcase with rotating alloy wheels"
      >
        <defs>
          <linearGradient id={`${uid}-body`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={palette.bodyTop} />
            <stop offset="52%" stopColor={palette.bodyMid} />
            <stop offset="100%" stopColor={palette.bodyBottom} />
          </linearGradient>

          <linearGradient id={`${uid}-glass`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A5F" stopOpacity="0.92" />
            <stop offset="45%" stopColor="#0F172A" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#080D18" stopOpacity="0.98" />
          </linearGradient>

          <linearGradient id={`${uid}-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          <linearGradient id={`${uid}-spoke`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" />
            <stop offset="60%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          <linearGradient id={`${uid}-headlight`} x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#3B82F6" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>

          <linearGradient id={`${uid}-taillight`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </linearGradient>

          <linearGradient id={`${uid}-scan`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
            <stop offset="65%" stopColor="#3B82F6" stopOpacity="0.22" />
            <stop offset="94%" stopColor="#22D3EE" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
          </linearGradient>

          <clipPath id={`${uid}-body-clip`}>
            <path d={bodyPath} />
          </clipPath>

          <filter id={`${uid}-glow`} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Subtle aerodynamic cyan/blue light trails behind car */}
        {showLightTrails && (
          <g opacity="0.65">
            <rect
              x="40"
              y="112"
              width="220"
              height="1.6"
              rx="1"
              fill="#22D3EE"
              className="ch-light-trail-1"
            />
            <rect
              x="160"
              y="168"
              width="280"
              height="1.4"
              rx="1"
              fill="#3B82F6"
              className="ch-light-trail-2"
            />
            <rect
              x="90"
              y="222"
              width="190"
              height="1.2"
              rx="1"
              fill="#22D3EE"
              className="ch-light-trail-3"
            />
          </g>
        )}

        {/* Road surface horizon & motion dashes */}
        <line x1="24" y1="291" x2="856" y2="291" stroke="#263449" strokeWidth="1.5" />
        <g opacity="0.45" className={spinning ? 'ch-road-motion' : ''}>
          {[40, 120, 200, 280, 360, 440, 520, 600, 680, 760, 840, 920].map((x) => (
            <rect key={x} x={x} y="295" width="34" height="2" rx="1" fill="#3B82F6" opacity="0.45" />
          ))}
        </g>

        {/* Undercarriage ambient shadow + subtle blue ground bounce */}
        <ellipse cx="435" cy="289" rx="345" ry="12" fill="#040812" opacity="0.9" />
        <ellipse cx="435" cy="289" rx="260" ry="5" fill="#3B82F6" opacity="0.18" />

        {/* Forward LED headlight projection beam */}
        <polygon points="94,184 0,152 0,248 94,212" fill={`url(#${uid}-headlight)`} />
        {/* Subtle rear LED trail glow */}
        <polygon points="786,164 875,152 875,204 786,184" fill={`url(#${uid}-taillight)`} />

        {/* STATIONARY VEHICLE BODY */}
        <g>
          {/* Main metallic shell */}
          <path d={bodyPath} fill={`url(#${uid}-body)`} stroke="#334155" strokeWidth="1.5" />

          {/* Upper specular roofline highlight */}
          <path
            d={
              isSuv
                ? 'M 230 135 L 302 88 C 344 68 440 67 566 75'
                : 'M 258 140 L 352 94 C 398 75 478 75 556 90'
            }
            fill="none"
            stroke={palette.highlight}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Sculpted aerodynamic side character crease */}
          <path
            d="M 118 186 C 210 176 340 174 475 170 C 578 167 686 164 764 166"
            fill="none"
            stroke={palette.accentLine}
            strokeWidth="1.4"
            opacity="0.55"
          />
          <path
            d="M 294 218 L 538 214"
            fill="none"
            stroke="#22D3EE"
            strokeWidth="1.2"
            opacity="0.4"
          />

          {/* Side intake vent & rocker skirt */}
          <path d="M 296 232 L 534 232 L 526 242 L 304 242 Z" fill="#09101D" />
          <path d="M 296 184 L 314 184 L 304 220 L 290 220 Z" fill="#0B1220" opacity="0.7" />

          {/* Greenhouse / Tinted Glass Cabin */}
          <path d={cabinPath} fill={`url(#${uid}-glass)`} stroke="#475569" strokeWidth="1.2" />
          {/* B-pillar */}
          <line x1="454" y1="86" x2="444" y2="142" stroke="#0B1220" strokeWidth="7" />
          <line x1="454" y1="86" x2="444" y2="142" stroke="#334155" strokeWidth="1" />
          {/* Glass reflection streak */}
          <path
            d="M 332 126 L 382 94 L 414 94 L 362 128 Z"
            fill="#FFFFFF"
            opacity="0.09"
          />

          {/* Side mirror */}
          <path
            d="M 312 138 C 304 134 294 136 292 142 C 292 146 300 148 310 147 Z"
            fill={palette.bodyTop}
            stroke="#475569"
            strokeWidth="1"
          />

          {/* Flush door handles */}
          <rect x="406" y="156" width="22" height="3.2" rx="1.6" fill="#64748B" />
          <rect x="526" y="154" width="20" height="3.2" rx="1.6" fill="#64748B" />

          {/* Matrix LED Headlight signature (left / front) */}
          <g filter={`url(#${uid}-glow)`}>
            <path
              d="M 96 188 C 110 178 134 174 152 178 L 138 188 C 122 187 108 190 96 194 Z"
              fill="#22D3EE"
            />
            <path d="M 102 189 L 146 181" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
          </g>

          {/* Rear LED Lightbar (right / tail) */}
          <g filter={`url(#${uid}-glow)`}>
            <path
              d="M 744 162 L 784 166 L 780 176 L 736 171 Z"
              fill="#EF4444"
            />
            <line x1="744" y1="167" x2="782" y2="170" stroke="#FCA5A5" strokeWidth="1.5" />
          </g>

          {/* Front wheel arch flare */}
          <path
            d="M 146 244 C 148 190 180 162 219 162 C 258 162 290 190 292 244"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.4"
            opacity="0.35"
          />
          {/* Rear wheel arch flare */}
          <path
            d="M 538 244 C 540 190 572 162 611 162 C 650 162 682 190 684 244"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.4"
            opacity="0.35"
          />

          {/* Diagnostic Horizontal Scan Beam clipped to vehicle silhouette */}
          {showScan && (
            <g clipPath={`url(#${uid}-body-clip)`}>
              <g className="ch-scan-beam">
                <rect x="0" y="55" width="135" height="205" fill={`url(#${uid}-scan)`} />
                <line
                  x1="134"
                  y1="55"
                  x2="134"
                  y2="260"
                  stroke="#22D3EE"
                  strokeWidth="2.5"
                  filter={`url(#${uid}-glow)`}
                />
              </g>
            </g>
          )}
        </g>

        {/* Exterior subtle laser scan guide line across full frame */}
        {showScan && (
          <g className="ch-scan-beam" opacity="0.5">
            <line x1="134" y1="54" x2="134" y2="291" stroke="#22D3EE" strokeWidth="1" strokeDasharray="4 4" />
          </g>
        )}

        {/* INDEPENDENTLY ROTATING FRONT & REAR ALLOY WHEELS */}
        <AlloyWheel
          cx={frontWheelX}
          cy={wheelY}
          r={wheelR}
          spinning={spinning}
          speed={wheelSpeed}
          caliperColor={palette.caliper}
          idPrefix={uid}
        />
        <AlloyWheel
          cx={rearWheelX}
          cy={wheelY}
          r={wheelR}
          spinning={spinning}
          speed={wheelSpeed}
          caliperColor={palette.caliper}
          idPrefix={uid}
        />

        {/* Optional Interactive-style Telemetry Callout Nodes */}
        {showTelemetryNodes && (
          <g fontFamily="Inter, sans-serif">
            {/* Powertrain / Front motor node */}
            <g transform="translate(215, 134)">
              <circle r="10" fill="#3B82F6" opacity="0.22" className="ch-pulse-beacon" />
              <circle r="4.5" fill="#22D3EE" stroke="#0B1220" strokeWidth="1.5" />
              <line x1="4" y1="-4" x2="26" y2="-36" stroke="#3B82F6" strokeWidth="1" opacity="0.7" />
              <rect x="26" y="-58" width="128" height="28" rx="6" fill="#111C2E" fillOpacity="0.9" stroke="#263449" />
              <text x="36" y="-40" fill="#E2E8F0" fontSize="10.5" fontWeight="600">
                ECU · 98% Nominal
              </text>
            </g>

            {/* Battery / Chassis node */}
            <g transform="translate(430, 198)">
              <circle r="10" fill="#22D3EE" opacity="0.22" className="ch-pulse-beacon" />
              <circle r="4.5" fill="#3B82F6" stroke="#0B1220" strokeWidth="1.5" />
              <line x1="0" y1="-6" x2="0" y2="-132" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
              <rect x="-62" y="-160" width="134" height="28" rx="6" fill="#111C2E" fillOpacity="0.9" stroke="#263449" />
              <text x="-50" y="-142" fill="#22D3EE" fontSize="10.5" fontWeight="600">
                CAN Bus · 0 Faults
              </text>
            </g>

            {/* Rear wheel ABS node */}
            <g transform="translate(611, 178)">
              <circle r="10" fill="#10B981" opacity="0.22" className="ch-pulse-beacon" />
              <circle r="4.5" fill="#10B981" stroke="#0B1220" strokeWidth="1.5" />
              <line x1="6" y1="-6" x2="36" y2="-56" stroke="#10B981" strokeWidth="1" opacity="0.7" />
              <rect x="36" y="-76" width="128" height="28" rx="6" fill="#111C2E" fillOpacity="0.9" stroke="#263449" />
              <text x="46" y="-58" fill="#6EE7B7" fontSize="10.5" fontWeight="600">
                TPMS · 39.5 PSI
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
