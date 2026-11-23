import { Search, X } from 'lucide-react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search OBD-II codes, symptoms, or systems...',
  label,
  error,
  className = '',
  inputClassName = '',
  onClear,
  ...rest
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1.5 block text-xs font-medium tracking-wide text-[#94A3B8]">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#94A3B8]" />
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-[#111C2E] py-2.5 pl-10 pr-10 text-sm text-white placeholder-[#94A3B8]/70 transition-all duration-200 focus:outline-none ${
            error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-[#263449] hover:border-[#3B82F6]/40 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20'
          } ${inputClassName}`}
          {...rest}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-3 cursor-pointer rounded-md p-1 text-[#94A3B8] transition-colors hover:bg-[#172338] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
