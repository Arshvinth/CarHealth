import { Link } from 'react-router-dom';

export default function BrandLogo({ to = '/', size = 'md', showTagline = false }) {
  const iconDim = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-11 w-11' : 'h-9 w-9';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <Link to={to} className="group inline-flex items-center gap-3 focus:outline-none">
      <div
        className={`relative flex ${iconDim} items-center justify-center rounded-xl border border-[#263449] bg-[#111C2E] shadow-[0_0_24px_rgba(59,130,246,0.18)] transition-all duration-300 group-hover:border-[#3B82F6]/60 group-hover:shadow-[0_0_28px_rgba(34,211,238,0.28)]`}
      >
        <svg viewBox="0 0 40 40" className="h-6 w-6" fill="none" aria-hidden="true">
          <path
            d="M7 22L11.5 14C12.5 12.2 14.3 11 16.4 11H23.6C25.7 11 27.5 12.2 28.5 14L33 22"
            stroke="#3B82F6"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 23.5H13L15.8 18L19.5 27.5L23 20.5L25.8 23.5H34"
            stroke="#22D3EE"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13" cy="29.5" r="2.6" stroke="#FFFFFF" strokeWidth="1.8" />
          <circle cx="27" cy="29.5" r="2.6" stroke="#FFFFFF" strokeWidth="1.8" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={`${textSize} font-bold tracking-tight text-white`}>
          Car<span className="text-[#3B82F6]">Health</span>
        </span>
        {showTagline && (
          <span className="text-[11px] font-medium tracking-wide text-[#94A3B8]">
            Intelligent Vehicle Diagnostics
          </span>
        )}
      </div>
    </Link>
  );
}
