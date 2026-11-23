import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-lg',
}) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ch-modal-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050912]/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full ${maxWidth} overflow-hidden rounded-2xl border border-[#263449] bg-[#111C2E] shadow-[0_24px_64px_rgba(0,0,0,0.65)]`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#263449] px-6 py-4">
              <div>
                <h2 id="ch-modal-title" className="text-lg font-semibold text-white">
                  {title}
                </h2>
                {subtitle && <p className="mt-0.5 text-xs text-[#94A3B8]">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="cursor-pointer rounded-lg p-1.5 text-[#94A3B8] transition-colors hover:bg-[#172338] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>

            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-[#263449] bg-[#0B1220]/60 px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
