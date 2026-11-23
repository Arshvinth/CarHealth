import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Radio } from 'lucide-react';
import { BrandLogo } from './ui';
import { BRAND } from '../theme/tokens';

const PLATFORM_LINKS = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Symptom Checker', to: '/symptom-checker' },
  { label: 'OBD-II Diagnostics', to: '/diagnostics' },
  { label: 'Warning Lights', to: '/warning-lights' },
  { label: 'AI Assistant', to: '/ai-assistant' },
];

const VEHICLE_LINKS = [
  { label: 'My Garage', to: '/garage' },
  { label: 'Diagnostic History', to: '/history' },
  { label: 'Sample Fault Report', to: '/diagnostics/P0300' },
  { label: 'Account Settings', to: '/settings' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#263449] bg-[#0B1220]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <BrandLogo to="/" showTagline />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#94A3B8]">
              {BRAND.tagline} Precision automotive telemetry, instant OBD-II fault intelligence,
              and AI-guided diagnostics built for modern vehicles.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#111C2E] px-2.5 py-1 font-mono text-[11px] text-[#94A3B8]">
                <Cpu className="h-3.5 w-3.5 text-[#3B82F6]" />
                CAN-FD Ready
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#111C2E] px-2.5 py-1 font-mono text-[11px] text-[#94A3B8]">
                <Radio className="h-3.5 w-3.5 text-[#22D3EE]" />
                OBD-II ISO 15765
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#263449] bg-[#111C2E] px-2.5 py-1 font-mono text-[11px] text-[#94A3B8]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                End-to-End Telemetry
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Diagnostics Suite
            </h3>
            <ul className="mt-4 space-y-2.5">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#94A3B8] transition-colors hover:text-[#22D3EE]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Garage & Account Links */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
              Vehicle Management
            </h3>
            <ul className="mt-4 space-y-2.5">
              {VEHICLE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#94A3B8] transition-colors hover:text-[#22D3EE]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#263449]/80 pt-6 text-xs text-[#94A3B8] sm:flex-row">
          <p>© {new Date().getFullYear()} CarHealth Technologies. All rights reserved.</p>
          <p className="font-mono text-[11px] text-[#94A3B8]/80">
            SYSTEM STATUS: <span className="text-emerald-400">ALL TELEMETRY NODES OPERATIONAL</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
