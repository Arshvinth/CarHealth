import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, CarFront, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { VEHICLES } from '../data/mockData';

export default function DashboardLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');
  const navigate = useNavigate();

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const q = quickQuery.trim();
    if (!q) {
      navigate('/diagnostics');
      return;
    }
    navigate(`/diagnostics?q=${encodeURIComponent(q)}`);
    setQuickQuery('');
  };

  return (
    <div className="flex min-h-screen bg-[#0B1220] text-white">
      <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Cockpit Header */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-4 border-b border-[#263449] ch-glass px-4 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[#263449] bg-[#172338] p-2 text-white hover:border-[#3B82F6]/50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <form
              onSubmit={handleQuickSearch}
              className="relative hidden w-full max-w-md items-center sm:flex"
            >
              <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[#94A3B8]" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Quick OBD-II code lookup (e.g. P0300, C0035)..."
                className="w-full rounded-xl border border-[#263449] bg-[#0B1220]/90 py-2 pl-10 pr-4 text-sm text-white placeholder-[#94A3B8]/70 transition-all focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
              />
            </form>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => navigate('/garage')}
              className="hidden cursor-pointer items-center gap-2 rounded-xl border border-[#263449] bg-[#172338]/80 px-3 py-2 text-xs font-medium text-white transition-colors hover:border-[#3B82F6]/50 md:inline-flex"
            >
              <CarFront className="h-4 w-4 text-[#22D3EE]" />
              <span>{VEHICLES[0].name}</span>
              <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] text-emerald-400">
                96%
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/ai-assistant')}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#3B82F6]/35 bg-[#3B82F6]/12 px-3 py-2 text-xs font-medium text-[#60A5FA] transition-colors hover:bg-[#3B82F6] hover:text-white"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/diagnostics')}
              aria-label="Active diagnostic alerts"
              className="relative cursor-pointer rounded-xl border border-[#263449] bg-[#172338]/80 p-2 text-[#94A3B8] transition-colors hover:border-[#3B82F6]/50 hover:text-white"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/settings')}
              aria-label="User profile settings"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-[#3B82F6]/40 bg-gradient-to-br from-[#3B82F6] to-[#22D3EE] text-xs font-bold text-[#0B1220] shadow-[0_0_16px_rgba(59,130,246,0.3)]"
            >
              AM
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="relative flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
