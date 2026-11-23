import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  badge,
  className = '',
}) {
  return (
    <div
      className={`mb-7 flex flex-col justify-between gap-4 border-b border-[#263449]/80 pb-6 sm:flex-row sm:items-end ${className}`}
    >
      <div>
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2.5 flex items-center gap-1.5 text-xs text-[#94A3B8]">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.label}>
                  {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#263449]" />}
                  {crumb.to && !isLast ? (
                    <Link to={crumb.to} className="transition-colors hover:text-[#22D3EE]">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'font-medium text-white' : ''}>{crumb.label}</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
          {badge}
        </div>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#94A3B8]">{description}</p>
        )}
      </div>

      {actions && <div className="flex shrink-0 flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
