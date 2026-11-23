import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ScanLine,
  Cpu,
  Bot,
  AlertTriangle,
  CarFront,
  ShieldCheck,
  Gauge,
  Activity,
  Sparkles,
  CheckCircle2,
  Play,
  Pause,
} from 'lucide-react';
import CarShowcase from '../components/automotive/CarShowcase';
import WarningSymbol from '../components/automotive/WarningSymbol';
import {
  PrimaryButton,
  SecondaryButton,
  DiagnosticCard,
  SeverityBadge,
  PageTransition,
} from '../components/ui';
import { OBD_CODES, WARNING_LIGHTS } from '../data/mockData';
import { MOTION } from '../theme/tokens';

const DRIVE_MODES = [
  { id: 'cruise', label: 'Cruise', speed: '1.5s', scan: true },
  { id: 'sport', label: 'Sport', speed: '0.65s', scan: false },
  { id: 'inspect', label: 'Deep Scan', speed: '2.4s', scan: true },
];

const CAPABILITIES = [
  {
    icon: ScanLine,
    title: 'OBD-II Code Intelligence',
    desc: 'Instant plain-English breakdown of 18,400+ powertrain, chassis, body, and CAN-bus fault codes with freeze-frame telemetry.',
    to: '/diagnostics',
    accent: 'text-[#3B82F6]',
  },
  {
    icon: AlertTriangle,
    title: 'Warning Light Library',
    desc: 'Decode every instrument cluster indicator with instant severity ratings, drivability guidance, and related trouble codes.',
    to: '/warning-lights',
    accent: 'text-amber-400',
  },
  {
    icon: Bot,
    title: 'AI Diagnostic Assistant',
    desc: 'Ask natural questions about symptoms, dashboard warnings, or repair priorities — grounded in your exact vehicle data.',
    to: '/ai-assistant',
    accent: 'text-[#22D3EE]',
  },
  {
    icon: CarFront,
    title: 'Multi-Vehicle Garage',
    desc: 'Track EV battery health, service intervals, tire pressure telemetry, and scan logs across every vehicle you own.',
    to: '/garage',
    accent: 'text-emerald-400',
  },
];

const HERO_STATS = [
  { value: '18,400+', label: 'OBD-II Codes Indexed' },
  { value: '42', label: 'ECU Modules Scanned' },
  { value: '< 12s', label: 'Full Vehicle Sweep' },
  { value: '99.4%', label: 'Fault Pinpoint Accuracy' },
];

export default function Welcome() {
  const navigate = useNavigate();
  const [driveMode, setDriveMode] = useState(DRIVE_MODES[0]);
  const [wheelsSpinning, setWheelsSpinning] = useState(true);

  return (
    <PageTransition>
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-[#263449]/80 ch-grid-bg">
        {/* Ambient radial cyan/blue studio lighting */}
        <div
          className="pointer-events-none absolute -top-32 left-1/2 h-[540px] w-[960px] -translate-x-1/2 rounded-full blur-3xl ch-ambient-glow"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(59,130,246,0.22) 0%, rgba(34,211,238,0.1) 45%, transparent 72%)',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-20 sm:px-6 lg:px-8 lg:pt-20 lg:pb-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Hero Copy */}
            <motion.div
              variants={MOTION.fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="lg:col-span-5"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#3B82F6]/35 bg-[#111C2E]/90 px-3.5 py-1.5 text-xs font-medium text-[#22D3EE] shadow-[0_0_24px_rgba(34,211,238,0.12)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22D3EE]" />
                Next-Gen Vehicle Diagnostics &amp; Telemetry
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.08]">
                Understand Your Vehicle.{' '}
                <span className="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#22D3EE] bg-clip-text text-transparent">
                  Drive With Confidence.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-[#94A3B8] sm:text-lg">
                CarHealth transforms raw OBD-II fault codes, dashboard warning lights, and live ECU
                telemetry into clear engineering-grade insights — before minor anomalies become
                costly repairs.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <PrimaryButton
                  size="lg"
                  iconRight={ArrowRight}
                  onClick={() => navigate('/dashboard')}
                >
                  Open Diagnostic Cockpit
                </PrimaryButton>
                <SecondaryButton
                  size="lg"
                  icon={ScanLine}
                  onClick={() => navigate('/diagnostics')}
                >
                  Search OBD-II Codes
                </SecondaryButton>
              </div>

              {/* Compact Trust & Protocol Strip */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#94A3B8]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ICE, Hybrid &amp; 800V EVs
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#3B82F6]" />
                  OEM-Level Fault Trees
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#22D3EE]" />
                  AI Mechanic Copilot
                </span>
              </div>
            </motion.div>

            {/* Hero Automotive Visual with Independently Spinning Wheels + Scan Beam */}
            <motion.div
              variants={MOTION.fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.12}
              className="lg:col-span-7"
            >
              <div className="relative overflow-hidden rounded-3xl border border-[#263449] bg-gradient-to-b from-[#172338]/90 via-[#111C2E] to-[#0B1220] p-4 shadow-[0_28px_70px_rgba(0,0,0,0.6)] sm:p-6">
                {/* Top HUD Bar */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-[#263449]/75 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#22D3EE] opacity-75 ch-pulse-beacon" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22D3EE]" />
                    </span>
                    <span className="font-mono text-xs font-medium tracking-wider text-white">
                      LIVE TELEMETRY BAY · 2024 TAYCAN 4S
                    </span>
                  </div>

                  {/* Interactive Drive / Wheel Rotation Controls */}
                  <div className="flex items-center gap-1.5">
                    {DRIVE_MODES.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => {
                          setDriveMode(mode);
                          setWheelsSpinning(true);
                        }}
                        className={`cursor-pointer rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                          driveMode.id === mode.id
                            ? 'bg-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.45)]'
                            : 'border border-[#263449] bg-[#0B1220]/70 text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setWheelsSpinning((s) => !s)}
                      aria-label={wheelsSpinning ? 'Pause wheel rotation' : 'Play wheel rotation'}
                      className="ml-1 inline-flex cursor-pointer items-center justify-center rounded-lg border border-[#263449] bg-[#0B1220]/70 p-1.5 text-[#22D3EE] transition-colors hover:border-[#3B82F6]/60"
                    >
                      {wheelsSpinning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Precision Car Showcase with Rotating Wheels */}
                <CarShowcase
                  variant="coupe"
                  finish="sapphire"
                  spinning={wheelsSpinning}
                  wheelSpeed={driveMode.speed}
                  showScan={driveMode.scan}
                  showLightTrails={wheelsSpinning}
                  showTelemetryNodes
                />

                {/* Bottom Live Telemetry Readout Strip */}
                <div className="mt-3 grid grid-cols-3 gap-2.5 border-t border-[#263449]/75 pt-3.5">
                  <div className="rounded-xl border border-[#263449]/70 bg-[#0B1220]/70 px-3 py-2">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8]">
                      Health Index
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-emerald-400">
                      96 / 100
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#263449]/70 bg-[#0B1220]/70 px-3 py-2">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8]">
                      High-Voltage SoH
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-[#22D3EE]">
                      800V · 98%
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#263449]/70 bg-[#0B1220]/70 px-3 py-2">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8]">
                      Wheel RPM Sync
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-white">
                      {wheelsSpinning ? (driveMode.id === 'sport' ? '1,180 RPM' : '640 RPM') : '0 RPM'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Metrics Row */}
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {HERO_STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                variants={MOTION.fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={idx * 0.06}
                className="rounded-2xl border border-[#263449] bg-[#111C2E]/85 p-5 text-center backdrop-blur-sm"
              >
                <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-[#94A3B8]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">
            Unified Automotive Intelligence
          </p>
          <h2 className="mt-2.5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Every diagnostic system engineered into one seamless cockpit.
          </h2>
          <p className="mt-3 text-base text-[#94A3B8]">
            Move effortlessly from live trouble codes to warning light decoding and AI-guided
            repair verification — all wrapped in one precision interface.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                variants={MOTION.fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                custom={idx * 0.07}
                whileHover={{ y: -4 }}
                onClick={() => navigate(cap.to)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(cap.to);
                  }
                }}
                className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-[#263449] bg-[#172338] p-6 shadow-[0_12px_32px_rgba(0,0,0,0.3)] transition-all duration-250 hover:border-[#3B82F6]/55"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#263449] bg-[#111C2E]">
                    <Icon className={`h-6 w-6 ${cap.accent}`} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-white group-hover:text-[#60A5FA] transition-colors">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{cap.desc}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#3B82F6] group-hover:text-[#22D3EE]">
                  Explore Module
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* VEHICLE HEALTH SCANNING & LIVE OBD-II PREVIEW */}
      <section className="border-y border-[#263449]/80 bg-[#111C2E]/55 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#3B82F6]">
                Real-Time Diagnostic Depth
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
                Instant fault decoding with OEM-grade clarity.
              </h2>
            </div>
            <SecondaryButton
              iconRight={ArrowRight}
              onClick={() => navigate('/diagnostics')}
            >
              Browse Full OBD-II Index
            </SecondaryButton>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Active Scanning Vehicle Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#263449] bg-[#172338] p-6 lg:col-span-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 font-mono text-xs text-[#22D3EE]">
                    <Cpu className="h-4 w-4" />
                    ACTIVE CHASSIS SWEEP
                  </span>
                  <SeverityBadge severity="moderate" label="2 Active Alerts" />
                </div>

                <div className="my-5 rounded-2xl border border-[#263449]/80 bg-[#0B1220] p-3">
                  <CarShowcase
                    variant="sedan"
                    finish="titanium"
                    spinning={false}
                    showScan
                    showLightTrails={false}
                  />
                </div>

                <h3 className="text-lg font-semibold text-white">2023 BMW M340i xDrive</h3>
                <p className="mt-1 text-sm text-[#94A3B8]">
                  Continuous blue laser scan visualizes real-time ECU polling across ignition,
                  emissions, ABS, and battery controllers.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#263449] pt-4 text-xs">
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Gauge className="h-4 w-4 text-[#3B82F6]" />
                  <span>38 ECU Modules Online</span>
                </div>
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Activity className="h-4 w-4 text-[#22D3EE]" />
                  <span>12.6V Bus Nominal</span>
                </div>
              </div>
            </div>

            {/* Live Sample OBD-II Code Cards */}
            <div className="grid grid-cols-1 gap-4 lg:col-span-7">
              {OBD_CODES.slice(0, 3).map((code) => (
                <DiagnosticCard
                  key={code.code}
                  diagnostic={code}
                  onSelect={(item) => navigate(`/diagnostics/${item.code}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WARNING LIGHT PREVIEW STRIP */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">
              Instrument Cluster Decoder
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Never guess what a dashboard symbol means.
            </h2>
          </div>
          <SecondaryButton
            iconRight={ArrowRight}
            onClick={() => navigate('/warning-lights')}
          >
            View All 12 Indicators
          </SecondaryButton>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WARNING_LIGHTS.slice(0, 4).map((light) => (
            <motion.div
              key={light.id}
              whileHover={{ y: -3 }}
              onClick={() => navigate('/warning-lights')}
              className="cursor-pointer rounded-2xl border border-[#263449] bg-[#172338] p-5 transition-colors hover:border-[#3B82F6]/50"
            >
              <div className="flex items-center justify-between gap-3">
                <WarningSymbol symbol={light.symbol} color={light.color} />
                <SeverityBadge severity={light.severity} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{light.name}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#94A3B8]">{light.shortDesc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[#263449] bg-gradient-to-r from-[#111C2E] via-[#172338] to-[#111C2E] px-6 py-12 text-center shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-45"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, rgba(59,130,246,0.28), transparent 65%)',
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready for complete visibility into your vehicle?
            </h2>
            <p className="mt-3 text-base text-[#94A3B8]">
              Explore your live vehicle dashboard, inspect OBD-II reports, and consult CarHealth
              AI in seconds.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <PrimaryButton
                size="lg"
                iconRight={ArrowRight}
                onClick={() => navigate('/dashboard')}
              >
                Enter CarHealth Dashboard
              </PrimaryButton>
              <SecondaryButton
                size="lg"
                icon={Bot}
                onClick={() => navigate('/ai-assistant')}
              >
                Try AI Assistant
              </SecondaryButton>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
