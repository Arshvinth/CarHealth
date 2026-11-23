export default function LoadingSkeleton({ variant = 'card', count = 1, className = '' }) {
  const items = Array.from({ length: count });

  if (variant === 'stat') {
    return (
      <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#263449] bg-[#172338] p-5">
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 rounded ch-skeleton-shimmer" />
              <div className="h-10 w-10 rounded-xl ch-skeleton-shimmer" />
            </div>
            <div className="mt-4 h-8 w-28 rounded-lg ch-skeleton-shimmer" />
            <div className="mt-4 h-3 w-36 rounded ch-skeleton-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 rounded-xl border border-[#263449] bg-[#172338] p-4"
          >
            <div className="h-4 w-24 rounded ch-skeleton-shimmer" />
            <div className="h-4 flex-1 rounded ch-skeleton-shimmer" />
            <div className="h-6 w-20 rounded-full ch-skeleton-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-[#263449] bg-[#172338]">
          <div className="h-40 w-full ch-skeleton-shimmer" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 rounded ch-skeleton-shimmer" />
            <div className="h-3.5 w-full rounded ch-skeleton-shimmer" />
            <div className="h-3.5 w-4/5 rounded ch-skeleton-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
