import { SEVERITY_STYLES } from '../../theme/tokens';

export default function SeverityBadge({ severity = 'healthy', label, pulse = false, className = '' }) {
  const key = (severity || 'healthy').toLowerCase();
  const style = SEVERITY_STYLES[key] || SEVERITY_STYLES.healthy;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.badge} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 ch-pulse-beacon ${style.dot}`}
          />
        )}
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${style.dot}`} />
      </span>
      {label || style.label}
    </span>
  );
}
