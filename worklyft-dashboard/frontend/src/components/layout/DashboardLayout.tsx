'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/DashboardLayout.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppStore } from '@/store/useAppStore';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isTransitioning } = useAppStore();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main
          id="main-content"
          role="main"
          className="flex-1 overflow-y-auto p-6"
        >
          <AnimatePresence mode="wait">
            {isTransitioning ? (
              <motion.div
                key="transitioning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Skeleton placeholders during user switch */}
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="skeleton h-32 rounded-xl" />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="skeleton h-64 rounded-xl" />
                  <div className="skeleton h-64 rounded-xl" />
                </div>
                <div className="skeleton h-80 rounded-xl" />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
