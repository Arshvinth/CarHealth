import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ScanLine, SlidersHorizontal, Sparkles } from 'lucide-react';
import {
  PageHeader,
  SearchInput,
  DiagnosticCard,
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  PageTransition,
} from '../components/ui';
import { OBD_CODES } from '../data/mockData';

const SEVERITY_FILTERS = [
  { id: 'all', label: 'All Severities' },
  { id: 'critical', label: 'Critical' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'healthy', label: 'Resolved / Healthy' },
];

const QUICK_CODES = ['P0300', 'P0420', 'C0035', 'P0171', 'U0100'];

export default function Diagnostics() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [severity, setSeverity] = useState('all');

  const filteredCodes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return OBD_CODES.filter((item) => {
      const matchesSeverity =
        severity === 'all' ||
        (severity === 'healthy'
          ? item.severity === 'healthy' || item.status === 'resolved'
          : item.severity === severity);

      if (!matchesSeverity) return false;
      if (!q) return true;

      return (
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.system.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.vehicleName.toLowerCase().includes(q)
      );
    });
  }, [query, severity]);

  const handleQueryChange = (val) => {
    setQuery(val);
    if (val) {
      setSearchParams({ q: val }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <PageTransition>
      <PageHeader
        title="OBD-II Code Diagnostics"
        description="Search standard and manufacturer-specific diagnostic trouble codes with instant root-cause trees and freeze-frame snapshots."
        breadcrumbs={[
          { label: 'CarHealth', to: '/' },
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Diagnostics' },
        ]}
        actions={
          <SecondaryButton icon={Sparkles} onClick={() => navigate('/ai-assistant')}>
            Diagnose With AI
          </SecondaryButton>
        }
      />

      {/* Premium Search & Filter Panel */}
      <section className="rounded-2xl border border-[#263449] bg-[#172338] p-5 shadow-[0_12px_32px_rgba(0,0,0,0.3)] sm:p-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SearchInput
              label="OBD-II Trouble Code, Symptom, or Subsystem"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onClear={() => handleQueryChange('')}
              placeholder="Try P0300, misfire, catalyst, ABS, CAN bus, Audi Q8..."
            />
          </div>

          <div className="lg:col-span-5">
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium tracking-wide text-[#94A3B8]">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#3B82F6]" />
              Filter By Severity
            </p>
            <div className="flex flex-wrap gap-2">
              {SEVERITY_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSeverity(f.id)}
                  className={`cursor-pointer rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                    severity === f.id
                      ? 'bg-[#3B82F6] text-white shadow-[0_0_16px_rgba(59,130,246,0.35)]'
                      : 'border border-[#263449] bg-[#111C2E] text-[#94A3B8] hover:border-[#3B82F6]/45 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Lookup Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#263449]/75 pt-4 text-xs">
          <span className="inline-flex items-center gap-1.5 text-[#94A3B8]">
            <ScanLine className="h-3.5 w-3.5 text-[#22D3EE]" />
            Popular Codes:
          </span>
          {QUICK_CODES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => handleQueryChange(code)}
              className="cursor-pointer rounded-lg border border-[#263449] bg-[#0B1220] px-2.5 py-1 font-mono text-xs text-[#22D3EE] transition-colors hover:border-[#3B82F6] hover:bg-[#111C2E]"
            >
              {code}
            </button>
          ))}
        </div>
      </section>

      {/* Results Header */}
      <div className="mt-6 mb-4 flex items-center justify-between text-xs text-[#94A3B8]">
        <span>
          Showing <strong className="text-white">{filteredCodes.length}</strong> diagnostic code
          {filteredCodes.length === 1 ? '' : 's'}
        </span>
        {(query || severity !== 'all') && (
          <button
            type="button"
            onClick={() => {
              handleQueryChange('');
              setSeverity('all');
            }}
            className="cursor-pointer font-medium text-[#22D3EE] hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Diagnostic Code Cards */}
      {filteredCodes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredCodes.map((item) => (
            <DiagnosticCard
              key={item.code}
              diagnostic={item}
              onSelect={(d) => navigate(`/diagnostics/${d.code}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching OBD-II codes found"
          description={`We couldn't find any codes matching "${query}". Try searching by standard code format (e.g. P0300) or clear filters.`}
          action={
            <PrimaryButton
              onClick={() => {
                handleQueryChange('');
                setSeverity('all');
              }}
            >
              Show All Codes
            </PrimaryButton>
          }
        />
      )}
    </PageTransition>
  );
}
