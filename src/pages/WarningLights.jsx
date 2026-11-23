import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowUpRight, Bot } from 'lucide-react';
import WarningSymbol from '../components/automotive/WarningSymbol';
import {
  PageHeader,
  SearchInput,
  SeverityBadge,
  EmptyState,
  Modal,
  PrimaryButton,
  SecondaryButton,
  PageTransition,
} from '../components/ui';
import { WARNING_LIGHTS } from '../data/mockData';

const SEVERITIES = [
  { id: 'all', label: 'All Indicators' },
  { id: 'critical', label: 'Critical (Stop)' },
  { id: 'moderate', label: 'Moderate (Caution)' },
  { id: 'healthy', label: 'Status / Active' },
];

export default function WarningLights() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState('all');
  const [selectedLight, setSelectedLight] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WARNING_LIGHTS.filter((item) => {
      const matchSev = severity === 'all' || item.severity === severity;
      if (!matchSev) return false;
      if (!q) return true;
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.shortDesc.toLowerCase().includes(q) ||
        item.relatedCodes.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [query, severity]);

  return (
    <PageTransition>
      <PageHeader
        title="Warning Light Library"
        description="Identify every instrument cluster indicator instantly with ISO-accurate symbols, urgency ratings, and recommended driver actions."
        breadcrumbs={[
          { label: 'CarHealth', to: '/' },
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Warning Lights' },
        ]}
        actions={
          <SecondaryButton icon={Bot} onClick={() => navigate('/ai-assistant')}>
            Describe a Symbol to AI
          </SecondaryButton>
        }
      />

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#263449] bg-[#172338] p-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full lg:max-w-md">
          <SearchInput
            label="Search Instrument Cluster Symbols"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            placeholder="Search ABS, oil, coolant, battery, TPMS..."
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {SEVERITIES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSeverity(s.id)}
              className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                severity === s.id
                  ? 'bg-[#3B82F6] text-white shadow-[0_0_16px_rgba(59,130,246,0.35)]'
                  : 'border border-[#263449] bg-[#111C2E] text-[#94A3B8] hover:border-[#3B82F6]/45 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Warning Light Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((light) => (
            <motion.article
              key={light.id}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedLight(light)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedLight(light);
                }
              }}
              className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#263449] bg-[#172338] p-5 shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition-all hover:border-[#3B82F6]/55 hover:bg-[#1C2B45]"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <WarningSymbol symbol={light.symbol} color={light.color} />
                  <SeverityBadge
                    severity={light.severity}
                    pulse={light.severity === 'critical'}
                  />
                </div>

                <div className="mt-4">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#22D3EE]">
                    {light.category}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-white group-hover:text-[#60A5FA] transition-colors">
                    {light.name}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#94A3B8]">
                    {light.shortDesc}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#263449]/75 pt-3.5">
                <div className="flex flex-wrap gap-1.5">
                  {light.relatedCodes.slice(0, 2).map((code) => (
                    <span
                      key={code}
                      className="rounded-md border border-[#263449] bg-[#0B1220] px-2 py-0.5 font-mono text-[11px] text-[#94A3B8]"
                    >
                      {code}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#3B82F6] group-hover:text-[#22D3EE]">
                  Guidance
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No warning indicators match"
          description="Try searching by system name (e.g., brake, battery, engine) or switch severity filters."
          action={
            <PrimaryButton
              onClick={() => {
                setQuery('');
                setSeverity('all');
              }}
            >
              Reset Library Filters
            </PrimaryButton>
          }
        />
      )}

      {/* Detail Modal */}
      <Modal
        open={Boolean(selectedLight)}
        onClose={() => setSelectedLight(null)}
        title={selectedLight?.name || ''}
        subtitle={selectedLight ? `${selectedLight.category} Instrument Indicator` : ''}
        footer={
          selectedLight && (
            <>
              <SecondaryButton onClick={() => setSelectedLight(null)}>Close</SecondaryButton>
              <PrimaryButton
                icon={Bot}
                onClick={() => {
                  const name = selectedLight.name;
                  setSelectedLight(null);
                  navigate(
                    `/ai-assistant?prompt=${encodeURIComponent(`My ${name} warning light just turned on. What should I do?`)}`
                  );
                }}
              >
                Ask AI Assistant
              </PrimaryButton>
            </>
          )
        }
      >
        {selectedLight && (
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-xl border border-[#263449] bg-[#0B1220] p-4">
              <WarningSymbol symbol={selectedLight.symbol} color={selectedLight.color} size="lg" />
              <div>
                <SeverityBadge severity={selectedLight.severity} />
                <p className="mt-2 text-sm text-[#E2E8F0]">{selectedLight.shortDesc}</p>
              </div>
            </div>

            <div className="rounded-xl border border-[#263449] bg-[#172338] p-4">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#22D3EE]">
                <ShieldAlert className="h-4 w-4" />
                Immediate Driver Action
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white">{selectedLight.action}</p>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                Related OBD-II Trouble Codes
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedLight.relatedCodes.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setSelectedLight(null);
                      navigate(`/diagnostics/${code}`);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/12 px-3 py-1.5 font-mono text-xs font-medium text-[#22D3EE] transition-colors hover:bg-[#3B82F6] hover:text-white"
                  >
                    {code}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </PageTransition>
  );
}
