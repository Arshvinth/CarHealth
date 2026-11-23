import { NavLink, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Stethoscope,
  ScanSearch,
  AlertTriangle,
  Bot,
  CarFront,
  History,
  Settings,
  X,
  Radio,
  LogOut,
} from 'lucide-react';
import { BrandLogo } from './ui';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Symptom Checker', to: '/symptom-checker', icon: Stethoscope },
  { label: 'Diagnostics', to: '/diagnostics', icon: ScanSearch },
  { label: 'Warning Lights', to: '/warning-lights', icon: AlertTriangle },
  { label: 'AI Assistant', to: '/ai-assistant', icon: Bot },
  { label: 'My Garage', to: '/garage', icon: CarFront },
  { label: 'Diagnostic History', to: '/history', icon: History },
  { label: 'Settings', to: '/settings', icon: Settings },
];

function SidebarContent({ onNavigate }) {
  return (
    <div className="flex h-full flex-col bg-[#111C2E] border-r border-[#263449]">
      {/* Brand Header */}
      <div className="flex h-18 items-center justify-between border-b border-[#263449] px-5">
        <BrandLogo to="/" size="sm" />
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            aria-label="Close sidebar"
            className="cursor-pointer rounded-lg p-1.5 text-[#94A3B8] hover:bg-[#172338] hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3.5 py-5" aria-label="Application navigation">
        <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-[#94A3B8]/70">
          Cockpit Navigation
        </p>
        {SIDEBAR_ITEMS.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#3B82F6]/15 text-white border border-[#3B82F6]/35 shadow-[0_0_20px_rgba(59,130,246,0.14)]'
                  : 'border border-transparent text-[#94A3B8] hover:bg-[#172338] hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-[#22D3EE]" />
                )}
                <Icon
                  className={`h-4.5 w-4.5 shrink-0 transition-colors ${
                    isActive ? 'text-[#22D3EE]' : 'text-[#94A3B8] group-hover:text-[#3B82F6]'
                  }`}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom OBD-II Telemetry Status & User Area */}
      <div className="space-y-3 border-t border-[#263449] p-4">
        <div className="rounded-xl border border-[#263449] bg-[#0B1220]/80 p-3.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-white">
              <Radio className="h-3.5 w-3.5 text-[#22D3EE]" />
              OBD-Link Pro
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
          <p className="mt-1.5 font-mono text-[11px] text-[#94A3B8]">
            CAN-FD · 500 kbps · 3 Vehicles
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-xl border border-[#263449]/70 bg-[#172338]/70 px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] text-xs font-bold text-[#0B1220]">
              AM
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">Alex Mercer</p>
              <p className="truncate text-[11px] text-[#94A3B8]">Pro Telemetry</p>
            </div>
          </div>
          <Link
            to="/"
            title="Return to Landing Page"
            className="rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-[#111C2E] hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile slide-over drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#050912]/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 h-full w-72 max-w-[85vw]"
            >
              <SidebarContent onNavigate={onClose} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
