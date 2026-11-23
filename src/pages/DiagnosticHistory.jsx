import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  Download,
  Filter,
  Stethoscope,
  CheckCircle2,
  Trash2,
  ScanLine,
} from 'lucide-react';
import {
  PageHeader,
  SearchInput,
  SeverityBadge,
  SecondaryButton,
  EmptyState,
  PrimaryButton,
  PageTransition,
} from '../components/ui';
import { DIAGNOSTIC_HISTORY } from '../data/mockData';
import {
  deleteSymptomReport,
  listSymptomReports,
  updateSymptomReport,
} from '../services/symptomService';
import { downloadDiagnosticPdf } from '../utils/pdfReport';

const STATUS_TABS = [
  { id: 'all', label: 'All Severities' },
  { id: 'critical', label: 'Critical' },
  { id: 'high', label: 'High' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'low', label: 'Low / Healthy' },
  { id: 'resolved', label: 'Resolved' },
];

const SOURCE_TABS = [
  { id: 'all', label: 'All History' },
  { id: 'symptom', label: 'AI Symptom Reports' },
  { id: 'obd', label: 'OBD-II Scans' },
];

function formatDateLabel(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DiagnosticHistory() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [symptomReports, setSymptomReports] = useState([]);

  useEffect(() => {
    let active = true;
    listSymptomReports().then(({ reports }) => {
      if (active) setSymptomReports(reports);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleToggleResolve = async (report) => {
    const nextStatus = report.status === 'Resolved' ? 'Open' : 'Resolved';
    const updated = await updateSymptomReport(report.id, { status: nextStatus });
    if (updated) {
      setSymptomReports((prev) => prev.map((r) => (r.id === report.id ? updated : r)));
    }
  };

  const handleDeleteSymptomReport = async (id) => {
    await deleteSymptomReport(id);
    setSymptomReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDownloadPdf = (report) => {
    downloadDiagnosticPdf({
      reportId: report.id,
      diagnosisDate: report.diagnosisDate,
      vehicleType: report.vehicleType,
      vehicleDetails: report.vehicleDetails,
      symptomDescription: report.symptomDescription,
      additionalSelections: report.additionalSelections,
      aiReport: report.aiReport,
      notes: report.notes,
      status: report.status,
    });
  };

  const unifiedRows = useMemo(() => {
    const mappedSymptoms = symptomReports.map((r) => {
      const vehicleName =
        [r.vehicleDetails?.year, r.vehicleDetails?.manufacturer, r.vehicleDetails?.model]
          .filter(Boolean)
          .join(' ') || `${String(r.vehicleType || 'Vehicle').toUpperCase()} Vehicle`;

      const rawSev = (r.severity || r.aiReport?.severityAssessment?.level || 'Moderate').toLowerCase();
      return {
        kind: 'symptom',
        id: r.id,
        date: formatDateLabel(r.diagnosisDate),
        vehicle: vehicleName,
        scanType: `AI Symptom Check · ${String(r.vehicleType || '').toUpperCase()}`,
        subtext: r.aiReport?.problemSummary?.affectedSystem || r.symptomDescription,
        primaryCode: r.aiReport?.possibleCauses?.[0]?.componentName || 'Symptom Assessment',
        severity: r.status === 'Resolved' ? 'resolved' : rawSev,
        statusLabel: r.status || 'Open',
        raw: r,
      };
    });

    const mappedObd = DIAGNOSTIC_HISTORY.map((row) => ({
      kind: 'obd',
      id: row.id,
      date: row.date,
      vehicle: row.vehicle,
      scanType: row.scanType,
      subtext: `Duration: ${row.duration}`,
      primaryCode: row.primaryCode,
      healthScore: row.healthScore,
      severity: row.severity,
      statusLabel: row.severity,
      raw: row,
    }));

    return [...mappedSymptoms, ...mappedObd];
  }, [symptomReports]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return unifiedRows.filter((row) => {
      if (sourceFilter !== 'all' && row.kind !== sourceFilter) return false;

      const matchStatus =
        status === 'all' ||
        (status === 'low'
          ? row.severity === 'low' || row.severity === 'healthy'
          : row.severity === status);
      if (!matchStatus) return false;

      if (!q) return true;
      return (
        row.id.toLowerCase().includes(q) ||
        row.vehicle.toLowerCase().includes(q) ||
        row.scanType.toLowerCase().includes(q) ||
        row.primaryCode.toLowerCase().includes(q) ||
        (row.subtext || '').toLowerCase().includes(q)
      );
    });
  }, [unifiedRows, query, status, sourceFilter]);

  return (
    <PageTransition>
      <PageHeader
        title="Diagnostic History"
        description="Unified chronological audit log of OBD-II scans and saved AI Symptom Checker diagnostic reports across your garage."
        breadcrumbs={[
          { label: 'CarHealth', to: '/' },
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Diagnostic History' },
        ]}
        actions={
          <>
            <SecondaryButton icon={ScanLine} onClick={() => navigate('/diagnostics')}>
              OBD-II Lookup
            </SecondaryButton>
            <PrimaryButton icon={Stethoscope} onClick={() => navigate('/symptom-checker')}>
              New Symptom Check
            </PrimaryButton>
          </>
        }
      />

      {/* Filter Toolbar */}
      <div className="mb-6 space-y-4 rounded-2xl border border-[#263449] bg-[#172338] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:max-w-md">
            <SearchInput
              label="Filter Diagnostic Logs & Saved Symptom Reports"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search report ID, vehicle, system, or OBD code..."
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {SOURCE_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSourceFilter(tab.id)}
                className={`cursor-pointer rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
                  sourceFilter === tab.id
                    ? 'bg-[#22D3EE] text-[#0B1220] font-semibold'
                    : 'border border-[#263449] bg-[#111C2E] text-[#94A3B8] hover:text-white'
                }`}
              >
                {tab.label}
                {tab.id === 'symptom' && symptomReports.length > 0 && (
                  <span className="ml-1.5 rounded-md bg-[#0B1220]/25 px-1.5 py-0.5 font-mono text-[10px]">
                    {symptomReports.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-[#263449]/75 pt-4">
          <span className="mr-1 inline-flex items-center gap-1 text-xs text-[#94A3B8]">
            <Filter className="h-3.5 w-3.5 text-[#3B82F6]" />
            Severity / Status:
          </span>
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatus(tab.id)}
              className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                status === tab.id
                  ? 'bg-[#3B82F6] text-white'
                  : 'border border-[#263449] bg-[#111C2E] text-[#94A3B8] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Unified Dark Data Table */}
      {rows.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-[#263449] bg-[#172338] shadow-[0_14px_34px_rgba(0,0,0,0.3)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#263449] bg-[#111C2E] text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  <th className="px-5 py-3.5">Report ID &amp; Date</th>
                  <th className="px-5 py-3.5">Vehicle</th>
                  <th className="px-5 py-3.5">Diagnostic Type</th>
                  <th className="px-5 py-3.5">Primary Finding / Code</th>
                  <th className="px-5 py-3.5">Severity / Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/75">
                {rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-[#1C2B45]/80">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-white">{row.id}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                            row.kind === 'symptom'
                              ? 'bg-[#22D3EE]/15 text-[#22D3EE]'
                              : 'bg-[#3B82F6]/15 text-[#60A5FA]'
                          }`}
                        >
                          {row.kind === 'symptom' ? 'AI' : 'OBD'}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-[#94A3B8]">{row.date}</p>
                    </td>

                    <td className="px-5 py-4 font-medium text-white">{row.vehicle}</td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-[#E2E8F0]">{row.scanType}</p>
                      <p className="mt-0.5 max-w-xs truncate text-xs text-[#94A3B8]">
                        {row.subtext}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      {row.kind === 'obd' ? (
                        <span
                          className={`rounded-md px-2.5 py-1 font-mono text-xs font-semibold ${
                            row.primaryCode === 'NONE'
                              ? 'bg-emerald-500/12 text-emerald-300'
                              : 'border border-[#3B82F6]/35 bg-[#3B82F6]/12 text-[#22D3EE]'
                          }`}
                        >
                          {row.primaryCode === 'NONE' ? '0 DTCs' : row.primaryCode}
                        </span>
                      ) : (
                        <span className="inline-block max-w-[190px] truncate rounded-md border border-[#263449] bg-[#0B1220] px-2.5 py-1 text-xs font-medium text-[#E2E8F0]">
                          {row.primaryCode}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <SeverityBadge severity={row.severity} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        {row.kind === 'symptom' && (
                          <>
                            <button
                              type="button"
                              title={
                                row.raw.status === 'Resolved' ? 'Reopen report' : 'Mark resolved'
                              }
                              onClick={() => handleToggleResolve(row.raw)}
                              className="cursor-pointer rounded-lg border border-[#263449] bg-[#111C2E] p-1.5 text-[#94A3B8] transition-colors hover:border-emerald-500/50 hover:text-emerald-300"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Download PDF Report"
                              onClick={() => handleDownloadPdf(row.raw)}
                              className="cursor-pointer rounded-lg border border-[#263449] bg-[#111C2E] p-1.5 text-[#94A3B8] transition-colors hover:border-[#3B82F6]/50 hover:text-[#22D3EE]"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Delete Report"
                              onClick={() => handleDeleteSymptomReport(row.id)}
                              className="cursor-pointer rounded-lg border border-[#263449] bg-[#111C2E] p-1.5 text-[#94A3B8] transition-colors hover:border-red-500/50 hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            row.kind === 'symptom'
                              ? navigate(`/symptom-checker/result/${row.id}`)
                              : navigate(
                                  row.primaryCode === 'NONE'
                                    ? '/diagnostics'
                                    : `/diagnostics/${row.primaryCode}`
                                )
                          }
                          className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#263449] bg-[#111C2E] px-3 py-1.5 text-xs font-medium text-[#22D3EE] transition-colors hover:border-[#3B82F6] hover:bg-[#3B82F6] hover:text-white"
                        >
                          {row.kind === 'symptom' ? 'Open' : 'Report'}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No diagnostic records match"
          description={
            sourceFilter === 'symptom'
              ? 'You have not saved any AI Symptom Checker reports yet. Run a symptom assessment and click "Save to History" to track it here.'
              : 'Try clearing the status filter or searching for a different vehicle or code.'
          }
          action={
            sourceFilter === 'symptom' ? (
              <PrimaryButton icon={Stethoscope} onClick={() => navigate('/symptom-checker')}>
                Open Symptom Checker
              </PrimaryButton>
            ) : (
              <PrimaryButton
                onClick={() => {
                  setQuery('');
                  setStatus('all');
                  setSourceFilter('all');
                }}
              >
                Reset History Filters
              </PrimaryButton>
            )
          }
        />
      )}
    </PageTransition>
  );
}
