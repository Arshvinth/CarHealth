import { useState } from 'react';
import { User, Bell, Radio, Sliders, CheckCircle2, Save } from 'lucide-react';
import { PageHeader, PrimaryButton, PageTransition } from '../components/ui';

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#263449]/75 bg-[#111C2E]/80 p-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-0.5 text-xs text-[#94A3B8]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ${
          checked
            ? 'border-[#3B82F6] bg-[#3B82F6]'
            : 'border-[#263449] bg-[#0B1220]'
        }`}
      >
        <span
          className={`pointer-events-none mt-0.5 inline-block h-4.5 w-4.5 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? 'translate-x-5.5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [profile, setProfile] = useState({
    name: 'Alex Mercer',
    email: 'alex.mercer@carhealth.io',
    units: 'imperial',
    adapter: 'OBD-Link MX+ Bluetooth 5.2',
  });

  const [prefs, setPrefs] = useState({
    criticalPush: true,
    autoScanOnStart: true,
    evThermalAlerts: true,
    reducedMotionOverride: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2600);
  };

  return (
    <PageTransition>
      <PageHeader
        title="System Settings"
        description="Configure your driver profile, OBD-II hardware pairing, measurement units, and diagnostic alert thresholds."
        breadcrumbs={[
          { label: 'CarHealth', to: '/' },
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Settings' },
        ]}
        actions={
          saved && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/35 bg-emerald-500/15 px-3.5 py-2 text-xs font-medium text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Preferences saved
            </span>
          )
        }
      />

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Profile & Hardware */}
        <div className="space-y-6 lg:col-span-7">
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <User className="h-4.5 w-4.5 text-[#3B82F6]" />
              Driver Profile
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#94A3B8]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-xl border border-[#263449] bg-[#111C2E] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#94A3B8]">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full rounded-xl border border-[#263449] bg-[#111C2E] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Radio className="h-4.5 w-4.5 text-[#22D3EE]" />
              Telemetry &amp; Hardware Interface
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#94A3B8]">
                  Connected OBD-II Adapter
                </label>
                <input
                  type="text"
                  value={profile.adapter}
                  onChange={(e) => setProfile({ ...profile, adapter: e.target.value })}
                  className="w-full rounded-xl border border-[#263449] bg-[#111C2E] px-3.5 py-2.5 font-mono text-xs text-white focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#94A3B8]">
                  Measurement Units
                </label>
                <select
                  value={profile.units}
                  onChange={(e) => setProfile({ ...profile, units: e.target.value })}
                  className="w-full rounded-xl border border-[#263449] bg-[#111C2E] px-3.5 py-2.5 text-sm text-white focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
                >
                  <option value="imperial">Imperial (mph, PSI, °F)</option>
                  <option value="metric">Metric (km/h, bar, °C)</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Alerts & Preferences */}
        <div className="space-y-6 lg:col-span-5">
          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Bell className="h-4.5 w-4.5 text-[#3B82F6]" />
              Diagnostic Notifications
            </h2>
            <div className="mt-4 space-y-3">
              <ToggleRow
                label="Critical Fault Alerts"
                description="Immediate alert when red-severity DTCs or oil/coolant warnings trigger."
                checked={prefs.criticalPush}
                onChange={(v) => setPrefs({ ...prefs, criticalPush: v })}
              />
              <ToggleRow
                label="Automatic Ignition Sweep"
                description="Poll primary powertrain & ABS ECUs automatically upon vehicle startup."
                checked={prefs.autoScanOnStart}
                onChange={(v) => setPrefs({ ...prefs, autoScanOnStart: v })}
              />
              <ToggleRow
                label="EV Battery Thermal Guard"
                description="Monitor high-voltage pack cell balance and inverter coolant loop."
                checked={prefs.evThermalAlerts}
                onChange={(v) => setPrefs({ ...prefs, evThermalAlerts: v })}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#263449] bg-[#172338] p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
              <Sliders className="h-4.5 w-4.5 text-[#22D3EE]" />
              Interface Preferences
            </h2>
            <div className="mt-4 space-y-3">
              <ToggleRow
                label="Minimal Motion Mode"
                description="Pause ambient scanning beams and subtle background trails."
                checked={prefs.reducedMotionOverride}
                onChange={(v) => setPrefs({ ...prefs, reducedMotionOverride: v })}
              />
            </div>

            <div className="mt-6 flex justify-end">
              <PrimaryButton type="submit" icon={Save}>
                Save Configuration
              </PrimaryButton>
            </div>
          </section>
        </div>
      </form>
    </PageTransition>
  );
}
