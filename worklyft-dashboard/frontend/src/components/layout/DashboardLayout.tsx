'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppStore } from '@/store/useAppStore';

const PERSONA_COLORS = {
  aggressive: { from: '#fb7185', to: '#f43f5e', label: 'Aggressive Growth' },
  steady:     { from: '#818cf8', to: '#6366f1', label: 'Steady State' },
  early:      { from: '#34d399', to: '#10b981', label: 'Early Stage' },
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isTransitioning, activeUser } = useAppStore();
  const persona = activeUser?.persona ?? 'steady';
  const colors = PERSONA_COLORS[persona];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        <Topbar />

        {/* ── User-switch transition banner ───────────────────────────────── */}
        <AnimatePresence>
          {isTransitioning && (
            <motion.div
              key="switch-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 top-14 z-50 pointer-events-none"
              aria-hidden="true"
            >
              {/* Subtle gradient wash over the content */}
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(ellipse 60% 40% at 50% 30%, ${colors.from}18, transparent 70%)`,
                }}
              />

              {/* Animated progress bar at top */}
              <motion.div
                className="absolute top-0 left-0 h-[2px] rounded-full"
                style={{ background: `linear-gradient(90deg, ${colors.from}, ${colors.to})` }}
                initial={{ width: '0%', opacity: 1 }}
                animate={{ width: '85%', opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              />

              {/* Floating "Switching…" pill */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-medium shadow-2xl backdrop-blur-md"
                  style={{
                    background: `linear-gradient(135deg, ${colors.from}22, ${colors.to}18)`,
                    borderColor: `${colors.from}40`,
                    color: colors.from,
                  }}
                >
                  {/* Spinner */}
                  <motion.span
                    className="inline-block w-3.5 h-3.5 rounded-full border-2 border-t-transparent"
                    style={{ borderColor: `${colors.from}60`, borderTopColor: 'transparent' }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }}
                  />
                  <span>Switching to {activeUser?.name}…</span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main content with per-user crossfade + slide-up ─────────────── */}
        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-y-auto p-6"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeUser?.id ?? 'loading'}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(2px)' }}
              transition={{
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1],
                // stagger children slightly for a cascade feel
                staggerChildren: 0.04,
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
