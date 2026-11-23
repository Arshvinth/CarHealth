import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#0B1220] text-white">
      {/* Subtle top atmospheric ambient glow */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-96 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 65% 45% at 50% -10%, rgba(59,130,246,0.22), transparent 70%)',
        }}
      />
      <Navbar />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
