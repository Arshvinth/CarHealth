import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  AlertOctagon,
  Wrench,
  CheckCircle2,
  Cpu,
  Bot,
  Activity,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';
import CarShowcase from '../components/automotive/CarShowcase';
import {
  PageHeader,
  SeverityBadge,
  PrimaryButton,
  SecondaryButton,
  PageTransition,
} from '../components/ui';
import { OBD_CODES, VEHICLES } from '../data/mockData';

export default function DiagnosticDetail() {
  const { code } = useParams();
  const navigate = useNavigate();

  const diagnostic =
    OBD_CODES.find((c) => c.code.toLowerCase() === (code || '').toLowerCase()) || OBD_CODES[0];
  const vehicle = VEHICLES.find((v) => v.id === diagnostic.vehicleId) || VEHICLES[0];

  return (
    <PageTransition>
      <PageHeader
        title={`${diagnostic.code} — ${diagnostic.title}`}
        description={diagnostic.summary}
        breadcrumbs={[
          { label: 'CarHealth', to: '/' },
          { label: 'Diagnostics', to: '/diagnostics' },
          { label: diagnostic.code },
        ]}
        badge={
          <SeverityBadge
            severity={diagnostic.status === 'resolved' ? 'resolved' : diagnostic.severity}
            pulse={diagnostic.severity === 'critical' && diagnostic.status === 'active'}
          />
        }
        actions={
          <>
            <SecondaryButton icon={ArrowLeft} onClick={() => navigate('/diagnostics')}>
              All Codes
            </SecondaryButton>
            <PrimaryButton
              icon={Bot}
              onClick={() => navigate(`/ai-assistant?prompt=${encodeURIComponent(`Explain ${diagnostic.code} on my ${diagnostic.vehicleName}`)}`)}
            >
              Ask AI About {diagnostic.code}
            </PrimaryButton>
          </>
        }
      />

      {/* Drivability Advisory Banner */}
      <div
        className={`mb-6 flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
          diagnostic.severity === 'critical'
            ? 'border-red-500/35 bg-red-500/10'
            : diagnostic.severity === 'moderate'
            ? 'border-amber-500/35 bg-amber-500/10'
            : 'border-emerald-500/35 bg-emerald-500/10'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <ShieldAlert
            className={`mt-0.5 h-5 w-5 shrink-0 ${
              diagnostic.severity === 'critical'
                ? 'text-red-400'
                : diagnostic.severity === 'moderate'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white">
              Drivability &amp; Safety Guidance
            </p>
            <p className="mt-1 text-sm text-[#E2E8F0]">{diagnostic.drivability}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-xl border border-[#263449] bg-[#0B1220]/75 px-4 py-2.5">
          <DollarSign className="h-4 w-4 text-[#22D3EE]" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#94A3B8]">Est. Repair Range</p>
            <p className="font-mono text-sm font-semibold text-white">{diagnostic.estimatedCost}</p>
          </div>
        </div>
      </div>

      {/* Main Technical Report Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Causes, Symptoms, Recommended Checks */}
        <div className="space-y-6 lg:col-span-7">
          {/* Probable Causes */}
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <AlertOctagon className="h-4.5 w-4.5 text-[#3B82F6]" />
              Probable Root Causes
            </h2>
            <ul className="mt-4 space-y-2.5">
              {diagnostic.causes.map((cause, idx) => (
                <li
                  key={cause}
                  className="flex items-start gap-3 rounded-xl border border-[#263449]/70 bg-[#111C2E]/80 p-3.5 text-sm text-[#E2E8F0]"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#3B82F6]/20 font-mono text-xs font-semibold text-[#22D3EE]">
                    {idx + 1}
                  </span>
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Common Symptoms */}
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Activity className="h-4.5 w-4.5 text-[#22D3EE]" />
              Observable Symptoms
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {diagnostic.symptoms.map((symptom) => (
                <div
                  key={symptom}
                  className="flex items-start gap-2.5 rounded-xl border border-[#263449]/70 bg-[#111C2E]/80 p-3.5 text-sm text-[#94A3B8]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#22D3EE]" />
                  <span>{symptom}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Diagnostic Checks */}
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Wrench className="h-4.5 w-4.5 text-emerald-400" />
              Recommended Verification Procedure
            </h2>
            <div className="mt-4 space-y-3">
              {diagnostic.recommendedChecks.map((check) => (
                <div
                  key={check.step}
                  className="flex items-start justify-between gap-4 rounded-xl border border-[#263449]/75 bg-[#111C2E]/80 p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#3B82F6]" />
                    <p className="text-sm text-white">{check.step}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                      check.priority === 'High'
                        ? 'bg-red-500/15 text-red-300'
                        : check.priority === 'Medium'
                        ? 'bg-amber-500/15 text-amber-300'
                        : 'bg-emerald-500/15 text-emerald-300'
                    }`}
                  >
                    {check.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Vehicle Context + Freeze-Frame Telemetry */}
        <div className="space-y-6 lg:col-span-5">
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#22D3EE]">
                Affected Vehicle
              </span>
              <span className="text-xs text-[#94A3B8]">{diagnostic.detectedAt}</span>
            </div>
            <h3 className="mt-1.5 text-lg font-semibold text-white">{vehicle.name}</h3>
            <p className="text-xs text-[#94A3B8]">{diagnostic.system}</p>

            <div className="my-4 rounded-xl border border-[#263449]/80 bg-[#0B1220] p-3">
              <CarShowcase
                variant={vehicle.bodyType}
                finish={vehicle.finish}
                spinning={false}
                showScan
                showLightTrails={false}
              />
            </div>

            <div className="flex items-center justify-between border-t border-[#263449] pt-3 text-xs text-[#94A3B8]">
              <span>VIN: {vehicle.vin}</span>
              <span className="font-mono text-white">{vehicle.mileage}</span>
            </div>
          </section>

          {/* Freeze-Frame Telemetry Data */}
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Cpu className="h-4.5 w-4.5 text-[#3B82F6]" />
              ECU Freeze-Frame Telemetry
            </h2>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Sensor values captured at the exact millisecond the fault threshold was breached.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {diagnostic.freezeFrame.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-xl border border-[#263449]/80 bg-[#111C2E] p-3.5"
                >
                  <p className="text-[11px] text-[#94A3B8]">{metric.label}</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-[#22D3EE]">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
