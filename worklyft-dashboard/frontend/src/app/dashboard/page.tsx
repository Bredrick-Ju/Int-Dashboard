'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { RevenueTrendChart } from '@/components/dashboard/RevenueTrendChart';
import { StrategyBudgetChart } from '@/components/dashboard/StrategyBudgetChart';
import { ChannelPerformanceChart } from '@/components/dashboard/ChannelPerformanceChart';
import { ActivityStatusDonut } from '@/components/dashboard/ActivityStatusDonut';
import { LeadKanban } from '@/components/dashboard/LeadKanban';
import { useDashboard } from '@/hooks/useDashboard';
import { useAppStore } from '@/store/useAppStore';
import { AlertCircle } from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1], delay: i * 0.07 },
  }),
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
      {/* Skeleton KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-32 rounded-xl" />
        ))}
      </div>
      {/* Skeleton Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="skeleton h-80 rounded-xl" />
        <div className="skeleton h-80 rounded-xl" />
        <div className="skeleton h-80 rounded-xl" />
        <div className="skeleton h-80 rounded-xl" />
      </div>
      {/* Skeleton Kanban */}
      <div className="skeleton h-[500px] rounded-xl" />
    </div>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError, error, isFetching } = useDashboard();
  const { activeUser } = useAppStore();

  return (
    <DashboardLayout>
      <AnimatePresence mode="wait">
        {/* ── Initial load (no cached data at all yet) ── */}
        {!data ? (
          <motion.div
            key="skeleton-initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DashboardSkeleton />
          </motion.div>

        ) : isError ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6"
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-4">
              <AlertCircle className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Failed to load dashboard</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md">
              {error instanceof Error ? error.message : 'An error occurred while fetching metrics.'}
            </p>
          </motion.div>

        ) : (
          <motion.div
            key={activeUser?.id ?? 'dashboard'}
            initial={{ opacity: 0 }}
            animate={{ opacity: isFetching ? 0.6 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* KPI Section */}
            <motion.div
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <KpiCards kpis={data.kpis} />
            </motion.div>

            {/* Charts Section */}
            <motion.div
              custom={1}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <RevenueTrendChart data={data.charts.revenueTrend} />
              <StrategyBudgetChart data={data.charts.strategyBudget} />
              <ChannelPerformanceChart data={data.charts.channelPerformance} />
              <ActivityStatusDonut data={data.charts.activityStatus} />
            </motion.div>

            {/* Kanban Board Section */}
            <motion.div
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
            >
              <LeadKanban leads={data.leads} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
