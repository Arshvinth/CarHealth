import { SearchX } from 'lucide-react';

export default function EmptyState({
  icon: Icon = SearchX,
  title = 'No results found',
  description = 'Try adjusting your search query or clearing active filters.',
  action,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#263449] bg-[#111C2E]/60 px-6 py-14 text-center ${className}`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#263449] bg-[#172338] text-[#22D3EE] shadow-[0_0_24px_rgba(34,211,238,0.12)]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm text-[#94A3B8]">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
