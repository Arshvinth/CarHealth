import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  CarFront,
  CheckCircle2,
  ScanLine,
  ArrowRight,
  Bot,
  Cpu,
  Gauge,
} from 'lucide-react';
import CarShowcase from '../components/automotive/CarShowcase';
import {
  PageHeader,
  PrimaryButton,
  SecondaryButton,
  StatCard,
  VehicleCard,
  DiagnosticCard,
  SeverityBadge,
  LoadingSkeleton,
  PageTransition,
} from '../components/ui';
import { VEHICLES, OBD_CODES } from '../data/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);
  const [isScanning, setIsScanning] = useState(false);

  const activeAlerts = OBD_CODES.filter((c) => c.status === 'active');

  const triggerVehicleScan = (vehicle = selectedVehicle) => {
    setSelectedVehicle(vehicle);
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1200);
  };

  return (
    <PageTransition>
      <PageHeader
        title="Vehicle Command Dashboard"
        description="Real-time health index, active OBD-II trouble codes, and ECU telemetry across your connected garage."
        breadcrumbs={[{ label: 'CarHealth', to: '/' }, { label: 'Dashboard' }]}
        actions={
          <>
            <SecondaryButton icon={Bot} onClick={() => navigate('/ai-assistant')}>
              Ask AI Copilot
            </SecondaryButton>
            <PrimaryButton
              icon={ScanLine}
              onClick={() => triggerVehicleScan(selectedVehicle)}
              disabled={isScanning}
            >
              {isScanning ? 'Scanning ECUs...' : 'Run Quick Scan'}
            </PrimaryButton>
          </>
        }
      />

      {/* Top KPI Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Fleet Health Index"
          value={76}
          suffix="%"
          trend="+4% vs last week"
          trendPositive
          sublabel="3 vehicles synced"
          icon={Activity}
          accent="cyan"
        />
        <StatCard
          label="Connected Vehicles"
          value={VEHICLES.length}
          trend="All OBD-II paired"
          trendPositive
          sublabel="124 total ECUs"
          icon={CarFront}
          accent="blue"
        />
        <StatCard
          label="Active Fault Codes"
          value={activeAlerts.length}
          trend="2 critical · 2 moderate"
          trendPositive={false}
          sublabel="Inspect required"
          icon={AlertTriangle}
          accent="amber"
        />
        <StatCard
          label="Resolved Diagnostics"
          value={18}
          trend="100% verified"
          trendPositive
          sublabel="Last 90 days"
          icon={CheckCircle2}
          accent="green"
        />
      </section>

      {/* Active Vehicle Telemetry Bay */}
      <section className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-[#263449] bg-[#172338] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.3)] lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs uppercase tracking-wider text-[#22D3EE]">
                  Active Telemetry Focus
                </span>
                <SeverityBadge
                  severity={selectedVehicle.status}
                  pulse={selectedVehicle.status === 'critical'}
                />
              </div>
              <h2 className="mt-1 text-xl font-bold text-white">{selectedVehicle.name}</h2>
              <p className="text-xs text-[#94A3B8]">
                VIN: <span className="font-mono text-white/85">{selectedVehicle.vin}</span> ·{' '}
                {selectedVehicle.powertrain}
              </p>
            </div>

            <div className="flex gap-1.5">
              {VEHICLES.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVehicle(v)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    selectedVehicle.id === v.id
                      ? 'bg-[#3B82F6] text-white'
                      : 'border border-[#263449] bg-[#111C2E] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {v.make}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-[#263449]/80 bg-gradient-to-b from-[#111C2E] to-[#0B1220] p-4">
            <CarShowcase
              variant={selectedVehicle.bodyType}
              finish={selectedVehicle.finish}
              spinning={isScanning}
              wheelSpeed="1.2s"
              showScan
              showLightTrails={isScanning}
            />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-[#263449]/75 bg-[#111C2E]/85 p-3">
              <p className="text-[11px] text-[#94A3B8]">Health Score</p>
              <p className="mt-1 font-mono text-base font-bold text-white">
                {selectedVehicle.healthScore}%
              </p>
            </div>
            <div className="rounded-xl border border-[#263449]/75 bg-[#111C2E]/85 p-3">
              <p className="text-[11px] text-[#94A3B8]">Battery Bus</p>
              <p className="mt-1 truncate font-mono text-sm font-semibold text-[#22D3EE]">
                {selectedVehicle.batteryVoltage.split('·')[0]}
              </p>
            </div>
            <div className="rounded-xl border border-[#263449]/75 bg-[#111C2E]/85 p-3">
              <p className="text-[11px] text-[#94A3B8]">Tire Pressure</p>
              <p className="mt-1 truncate font-mono text-xs font-semibold text-white">
                {selectedVehicle.tirePressure}
              </p>
            </div>
            <div className="rounded-xl border border-[#263449]/75 bg-[#111C2E]/85 p-3">
              <p className="text-[11px] text-[#94A3B8]">Next Service</p>
              <p className="mt-1 truncate font-mono text-xs font-semibold text-amber-300">
                {selectedVehicle.nextService}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Diagnostic Activity Feed */}
        <div className="flex flex-col rounded-2xl border border-[#263449] bg-[#172338] p-6 shadow-[0_14px_34px_rgba(0,0,0,0.3)] lg:col-span-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-white">Active Diagnostic Feed</h2>
              <p className="text-xs text-[#94A3B8]">Priority trouble codes detected across fleet</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/diagnostics')}
              className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-[#22D3EE] hover:underline"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 flex-1 space-y-3">
            {isScanning ? (
              <LoadingSkeleton variant="row" count={4} />
            ) : (
              activeAlerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.code}
                  onClick={() => navigate(`/diagnostics/${alert.code}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/diagnostics/${alert.code}`);
                    }
                  }}
                  className="group cursor-pointer rounded-xl border border-[#263449] bg-[#111C2E]/85 p-4 transition-all hover:border-[#3B82F6]/50 hover:bg-[#1C2B45]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm font-semibold text-[#22D3EE]">
                      {alert.code}
                    </span>
                    <SeverityBadge
                      severity={alert.severity}
                      pulse={alert.severity === 'critical'}
                    />
                  </div>
                  <p className="mt-1.5 text-sm font-medium text-white group-hover:text-[#60A5FA]">
                    {alert.title}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-[#94A3B8]">
                    <span>{alert.vehicleName}</span>
                    <span>{alert.detectedAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-4 py-3 text-xs">
            <div className="flex items-center gap-2 text-[#E2E8F0]">
              <Cpu className="h-4 w-4 text-[#22D3EE]" />
              <span>OBD-II live bus monitoring active</span>
            </div>
            <Gauge className="h-4 w-4 text-[#3B82F6]" />
          </div>
        </div>
      </section>

      {/* My Vehicles Snapshot */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Your Garage Overview</h2>
            <p className="text-xs text-[#94A3B8]">Hover any vehicle to engage live wheel telemetry &amp; scan sweep</p>
          </div>
          <SecondaryButton size="sm" iconRight={ArrowRight} onClick={() => navigate('/garage')}>
            Manage Garage
          </SecondaryButton>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {VEHICLES.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              compact
              onScan={(v) => triggerVehicleScan(v)}
              onSelect={() => navigate('/garage')}
            />
          ))}
        </div>
      </section>

      {/* Recent Trouble Code Reports */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent OBD-II Reports</h2>
          <SecondaryButton size="sm" iconRight={ArrowRight} onClick={() => navigate('/history')}>
            Scan History
          </SecondaryButton>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {OBD_CODES.slice(0, 4).map((diag) => (
            <DiagnosticCard
              key={diag.code}
              diagnostic={diag}
              onSelect={(d) => navigate(`/diagnostics/${d.code}`)}
            />
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
