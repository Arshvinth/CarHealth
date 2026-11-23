import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import { LoadingSkeleton } from '../components/ui';

import Welcome from '../pages/Welcome';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const SymptomChecker = lazy(() => import('../pages/SymptomChecker'));
const SymptomResult = lazy(() => import('../pages/SymptomResult'));
const ProblemDetails = lazy(() => import('../pages/ProblemDetails'));
const Diagnostics = lazy(() => import('../pages/Diagnostics'));
const DiagnosticDetail = lazy(() => import('../pages/DiagnosticDetail'));
const WarningLights = lazy(() => import('../pages/WarningLights'));
const AIAssistant = lazy(() => import('../pages/AIAssistant'));
const MyGarage = lazy(() => import('../pages/MyGarage'));
const DiagnosticHistory = lazy(() => import('../pages/DiagnosticHistory'));
const Settings = lazy(() => import('../pages/Settings'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function RouteFallback() {
  return (
    <div className="space-y-6 py-4">
      <LoadingSkeleton variant="stat" count={4} />
      <LoadingSkeleton variant="card" count={3} />
    </div>
  );
}

export default function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Landing Route */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Welcome />} />
            </Route>

            {/* Authenticated Cockpit Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/symptom-checker/result" element={<SymptomResult />} />
              <Route path="/symptom-checker/result/:reportId" element={<SymptomResult />} />
              <Route path="/symptom-checker/problems/:slug" element={<ProblemDetails />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/diagnostics/:code" element={<DiagnosticDetail />} />
              <Route path="/warning-lights" element={<WarningLights />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/garage" element={<MyGarage />} />
              <Route path="/history" element={<DiagnosticHistory />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}
