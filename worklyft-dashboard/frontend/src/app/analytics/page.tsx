'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/analytics/page.tsx — Detailed Performance Analytics
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters';
import { AlertCircle, TrendingUp, IndianRupee, Target, Award, PieChart, BarChart2 } from 'lucide-react';
import { StrategyBudgetChart } from '@/components/dashboard/StrategyBudgetChart';
import { ChannelPerformanceChart } from '@/components/dashboard/ChannelPerformanceChart';
import { cn } from '@/lib/utils';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';

export default function AnalyticsPage() {
  const { data, isLoading, isError, error } = useDashboard();

  // Compute advanced metrics
  const stats = useMemo(() => {
    if (!data) return null;

    const totalBudget = data.strategies.reduce((sum, s) => sum + s.budget, 0);
    const totalCost = data.channels.reduce((sum, c) => sum + c.cost, 0);
    const totalRevenue = data.kpis.totalRevenue;
    
    // ROI = (Revenue - Cost) / Cost * 100
    const netProfit = totalRevenue - totalCost;
    const roi = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
    
    // Budget efficiency (spent vs budget)
    const budgetUtilization = totalBudget > 0 ? (totalCost / totalBudget) * 100 : 0;

    // Strategies metrics
    const strategyPerformances = data.strategies.map((strategy) => {
      // Find channels under this strategy
      const strategyChannels = data.channels.filter((c) => c.strategyId === strategy.id);
      const cost = strategyChannels.reduce((sum, c) => sum + c.cost, 0);
      
      // Find leads under these channels
      const channelIds = new Set(strategyChannels.map((c) => c.id));
      const strategyActivities = data.activities.filter((a) => channelIds.has(a.channelId));
      const activityIds = new Set(strategyActivities.map((a) => a.id));
      const strategyLeads = data.leads.filter((l) => activityIds.has(l.activityId));
      const leadIds = new Set(strategyLeads.map((l) => l.id));
      const strategyOrders = data.orders.filter((o) => leadIds.has(o.leadId));
      
      const revenue = strategyOrders.reduce((sum, o) => sum + o.value, 0);
      const targetMet = strategy.targetRevenue > 0 ? (revenue / strategy.targetRevenue) * 100 : 0;

      return {
        ...strategy,
        cost,
        revenue,
        targetMet,
        channelsCount: strategyChannels.length,
        leadsCount: strategyLeads.length,
      };
    });

    return {
      totalBudget,
      totalCost,
      totalRevenue,
      roi,
      budgetUtilization,
      strategyPerformances,
    };
  }, [data]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6" aria-busy="true" aria-label="Loading analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="skeleton h-96 rounded-xl animate-pulse" />
          <div className="skeleton h-64 rounded-xl animate-pulse" />
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
          <h3 className="text-base font-semibold text-foreground">Failed to load analytics</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md">
            {error instanceof Error ? error.message : 'An error occurred while fetching metrics.'}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!data || !stats) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-lg font-bold text-foreground">Detailed Performance Analytics</h2>
          <p className="text-xs text-muted-foreground mt-0.5">ROI analysis, strategy outcomes, and efficiency metrics</p>
        </div>

        {/* Analytics Overview Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4" aria-label="Performance summary">
          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Return on Investment (ROI)</p>
              <h3 className={cn('text-xl font-bold mt-1 tracking-tight', stats.roi >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
                {stats.roi >= 0 ? '+' : ''}
                <AnimatedNumber
                  value={Math.abs(stats.roi) * 10}
                  formatter={(v) => `${(v / 10).toFixed(1)}%`}
                />
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Revenue relative to channel costs</p>
            </div>
          </div>

          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Budget Allocation</p>
              <h3 className="text-xl font-bold text-foreground mt-1 tracking-tight">
                <AnimatedNumber value={stats.totalCost} formatter={(v) => formatCurrency(v)} />
                {' / '}
                <AnimatedNumber value={stats.totalBudget} formatter={(v) => formatCurrency(v, true)} />
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                <AnimatedNumber
                  value={stats.budgetUtilization * 10}
                  formatter={(v) => `${(v / 10).toFixed(1)}%`}
                />
                {' of allocated budget utilized'}
              </p>
            </div>
          </div>

          <div className="glass-card p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pipeline Conversion</p>
              <h3 className="text-xl font-bold text-foreground mt-1 tracking-tight">
                <AnimatedNumber value={data.orders.length} formatter={(v) => String(v)} />
                {' / '}
                <AnimatedNumber value={data.leads.length} formatter={(v) => String(v)} />
                {' Orders'}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                <AnimatedNumber
                  value={data.leads.length > 0 ? (data.orders.length / data.leads.length) * 100 * 10 : 0}
                  formatter={(v) => `${(v / 10).toFixed(1)}%`}
                />
                {' lead-to-order rate'}
              </p>
            </div>
          </div>
        </section>

        {/* Strategy Breakdown Table */}
        <section className="glass-card p-6" aria-label="Strategy breakdown">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-foreground">Strategy Performance Audit</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="pb-3 pl-2">Strategy Name</th>
                  <th className="pb-3 text-right">Budget</th>
                  <th className="pb-3 text-right">Spend</th>
                  <th className="pb-3 text-right">Target Rev.</th>
                  <th className="pb-3 text-right">Actual Rev.</th>
                  <th className="pb-3 text-right">Target Progress</th>
                  <th className="pb-3 text-right pr-2">Sub-channels</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 text-xs">
                {stats.strategyPerformances.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 pl-2 font-medium text-foreground max-w-[200px] truncate">
                      {s.name}
                    </td>
                    <td className="py-3.5 text-right font-mono text-muted-foreground">
                      {formatCurrency(s.budget)}
                    </td>
                    <td className="py-3.5 text-right font-mono text-muted-foreground">
                      {formatCurrency(s.cost)}
                    </td>
                    <td className="py-3.5 text-right font-mono text-muted-foreground">
                      {formatCurrency(s.targetRevenue)}
                    </td>
                    <td className="py-3.5 text-right font-mono font-semibold text-foreground">
                      {formatCurrency(s.revenue)}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 bg-white/[0.05] border border-border rounded-full h-1.5 overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              s.targetMet >= 100 ? 'bg-emerald-400' : 'bg-indigo-400',
                            )}
                            style={{ width: `${Math.min(s.targetMet, 100)}%` }}
                          />
                        </div>
                        <span className="font-semibold w-8 text-[11px]">
                          {s.targetMet.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-right font-medium text-muted-foreground pr-2">
                      {s.channelsCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Charts Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StrategyBudgetChart data={data.charts.strategyBudget} />
          <ChannelPerformanceChart data={data.charts.channelPerformance} />
        </div>
      </div>
    </DashboardLayout>
  );
}
