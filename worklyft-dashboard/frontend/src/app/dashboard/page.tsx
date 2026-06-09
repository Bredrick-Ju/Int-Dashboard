'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/dashboard/page.tsx — Main Dashboard Overview
// ─────────────────────────────────────────────────────────────────────────────

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KpiCards } from '@/components/dashboard/KpiCards';
import { RevenueTrendChart } from '@/components/dashboard/RevenueTrendChart';
import { StrategyBudgetChart } from '@/components/dashboard/StrategyBudgetChart';
import { ChannelPerformanceChart } from '@/components/dashboard/ChannelPerformanceChart';
import { ActivityStatusDonut } from '@/components/dashboard/ActivityStatusDonut';
import { LeadKanban } from '@/components/dashboard/LeadKanban';
import { useDashboard } from '@/hooks/useDashboard';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading || !data) {
    return (
      <DashboardLayout>
        <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
          {/* Skeleton KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-32 rounded-xl animate-pulse" />
            ))}
          </div>
          {/* Skeleton Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="skeleton h-80 rounded-xl animate-pulse" />
            <div className="skeleton h-80 rounded-xl animate-pulse" />
          </div>
          {/* Skeleton Kanban */}
          <div className="skeleton h-[500px] rounded-xl animate-pulse" />
        </div>
      </DashboardLayout>
    );
  }

  if (isError) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-4">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Failed to load dashboard</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md">
            {error instanceof Error ? error.message : 'An error occurred while fetching metrics.'}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* KPI Section */}
        <KpiCards kpis={data.kpis} />

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueTrendChart data={data.charts.revenueTrend} />
          <StrategyBudgetChart data={data.charts.strategyBudget} />
          <ChannelPerformanceChart data={data.charts.channelPerformance} />
          <ActivityStatusDonut data={data.charts.activityStatus} />
        </div>

        {/* Kanban Board Section */}
        <LeadKanban leads={data.leads} />
      </div>
    </DashboardLayout>
  );
}
