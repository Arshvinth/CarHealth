import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { BrandLogo, PrimaryButton, SecondaryButton, Modal } from './ui';

const PUBLIC_LINKS = [
  { label: 'Overview', to: '/' },
  { label: 'Symptom Checker', to: '/symptom-checker' },
  { label: 'OBD-II Lookup', to: '/diagnostics' },
  { label: 'Warning Lights', to: '/warning-lights' },
  { label: 'Dashboard', to: '/dashboard' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModal, setAuthModal] = useState(null); // 'login' | 'signup' | null
  const [email, setEmail] = useState('alex.driver@carhealth.io');
  const [password, setPassword] = useState('••••••••••••');
  const location = useLocation();
  const navigate = useNavigate();

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthModal(null);
    setMobileOpen(false);
    navigate('/dashboard');
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#263449]/85 ch-glass">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo to="/" />

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {PUBLIC_LINKS.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? 'bg-[#172338] text-white border border-[#263449]'
                      : 'text-[#94A3B8] hover:bg-[#172338]/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <SecondaryButton size="sm" onClick={() => setAuthModal('login')}>
              Log In
            </SecondaryButton>
            <PrimaryButton
              size="sm"
              iconRight={ArrowRight}
              onClick={() => navigate('/dashboard')}
            >
              Get Started
            </PrimaryButton>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[#263449] bg-[#172338] p-2 text-white transition-colors hover:border-[#3B82F6]/50 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-[#263449] bg-[#0B1220] md:hidden"
            >
              <div className="space-y-1.5 px-4 py-4">
                {PUBLIC_LINKS.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? 'border border-[#3B82F6]/40 bg-[#172338] text-white'
                          : 'text-[#94A3B8] hover:bg-[#111C2E] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <SecondaryButton
                    size="sm"
                    onClick={() => {
                      setMobileOpen(false);
                      setAuthModal('login');
                    }}
                  >
                    Log In
                  </SecondaryButton>
                  <PrimaryButton
                    size="sm"
                    iconRight={ArrowRight}
                    onClick={() => {
                      setMobileOpen(false);
                      navigate('/dashboard');
                    }}
                  >
                    Get Started
                  </PrimaryButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Consistent Dark Automotive Auth Modal */}
      <Modal
        open={Boolean(authModal)}
        onClose={() => setAuthModal(null)}
        title={authModal === 'signup' ? 'Create Your CarHealth Account' : 'Sign In to CarHealth'}
        subtitle="Access real-time OBD-II diagnostics, vehicle garage, and AI telemetry."
      >
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#94A3B8]">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#263449] bg-[#0B1220] px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8]/60 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#94A3B8]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#263449] bg-[#0B1220] px-3.5 py-2.5 text-sm text-white placeholder-[#94A3B8]/60 focus:border-[#3B82F6] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20"
            />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#263449] bg-[#172338]/70 p-3 text-xs text-[#94A3B8]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#22D3EE]" />
            <span>Preview mode enabled — sign in to explore the full automotive cockpit.</span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAuthModal(authModal === 'login' ? 'signup' : 'login')}
              className="cursor-pointer text-xs font-medium text-[#22D3EE] hover:underline"
            >
              {authModal === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
            </button>
            <PrimaryButton type="submit" iconRight={ArrowRight}>
              {authModal === 'signup' ? 'Launch Cockpit' : 'Enter Dashboard'}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
