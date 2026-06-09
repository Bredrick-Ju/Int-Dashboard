'use client';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { RevenueTable } from '@/components/dashboard/RevenueTable';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import { AlertCircle, CreditCard, IndianRupee, Hourglass, CheckCircle2 } from 'lucide-react';
import { AnimatedNumber } from '@/components/dashboard/AnimatedNumber';

export default function RevenuePage() {
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6" aria-busy="true" aria-label="Loading revenue ledger">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-28 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="skeleton h-[400px] rounded-xl animate-pulse" />
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
          <h3 className="text-base font-semibold text-foreground">Failed to load revenue data</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-md">
            {error instanceof Error ? error.message : 'An error occurred while fetching metrics.'}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

  const { revenueSummary } = data;

  const cards = [
    {
      title: 'Total Contract Value',
      rawValue: revenueSummary.totalRevenue,
      formatter: (v: number) => formatCurrency(v),
      icon: <IndianRupee className="w-4 h-4 text-indigo-400" />,
      sub: 'All registered sales orders',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      title: 'Realized Revenue',
      rawValue: revenueSummary.totalPaid,
      formatter: (v: number) => formatCurrency(v),
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      sub: 'Total paid-in amount',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Outstanding Pipeline',
      rawValue: revenueSummary.totalPending,
      formatter: (v: number) => formatCurrency(v),
      icon: <Hourglass className="w-4 h-4 text-amber-400" />,
      sub: 'Unpaid pending orders',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Average Order Value',
      rawValue: revenueSummary.averageOrderValue,
      formatter: (v: number) => formatCurrency(v),
      icon: <CreditCard className="w-4 h-4 text-sky-400" />,
      sub: 'Across all order statuses',
      bg: 'bg-sky-500/10 border-sky-500/20',
    },
  ];

  const deliveryStats = [
    { label: 'Delivered', count: revenueSummary.deliveredOrders, color: 'bg-emerald-400' },
    { label: 'In Progress', count: revenueSummary.inProgressOrders, color: 'bg-indigo-400' },
    { label: 'Pending', count: revenueSummary.pendingOrders, color: 'bg-amber-400' },
  ];
  
  const totalDeliveries = revenueSummary.deliveredOrders + revenueSummary.inProgressOrders + revenueSummary.pendingOrders;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-lg font-bold text-foreground">Revenue Operations Ledger</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Order contracts, billing realizations, and fulfillment trackers</p>
        </div>

        {/* Revenue specific cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-label="Revenue summary cards">
          {cards.map((c, i) => (
            <div key={i} className={`glass-card p-5 flex flex-col justify-between min-h-[110px] border ${c.bg}`}>
              <div className="flex items-start justify-between">
                <p className="text-xs text-muted-foreground">{c.title}</p>
                <div className="p-1.5 rounded-md bg-white/[0.04] border border-border">
                  {c.icon}
                </div>
              </div>
              <div className="mt-2">
                <h3 className="text-lg font-bold text-foreground tracking-tight">
                  <AnimatedNumber value={c.rawValue} formatter={c.formatter} />
                </h3>
                <p className="text-[10px] text-muted-foreground mt-0.5">{c.sub}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Delivery Progress Bar */}
        <section className="glass-card p-5" aria-label="Fulfillment funnel">
          <div className="flex items-center justify-between text-xs mb-3">
            <span className="font-semibold text-foreground">
              Fulfillment Status (<AnimatedNumber value={totalDeliveries} formatter={(v) => String(v)} /> orders)
            </span>
            <div className="flex items-center gap-4 text-muted-foreground text-[10px]">
              {deliveryStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${stat.color}`} />
                  <span>
                    {stat.label} (<AnimatedNumber value={stat.count} formatter={(v) => String(v)} />)
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full bg-white/[0.04] border border-border/80 h-3 rounded-full overflow-hidden flex">
            {deliveryStats.map((stat) => {
              if (totalDeliveries === 0) return null;
              const percent = (stat.count / totalDeliveries) * 100;
              return (
                <div
                  key={stat.label}
                  className={`h-full ${stat.color} transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                  title={`${stat.label}: ${stat.count} (${percent.toFixed(0)}%)`}
                />
              );
            })}
          </div>
        </section>

        {/* Ledger Table */}
        <RevenueTable orders={data.orders} leads={data.leads} />
      </div>
    </DashboardLayout>
  );
}
