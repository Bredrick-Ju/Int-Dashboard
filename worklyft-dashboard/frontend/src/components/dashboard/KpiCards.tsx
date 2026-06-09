'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/dashboard/KpiCards.tsx — KPI cards grid
// ─────────────────────────────────────────────────────────────────────────────

import { IndianRupee, ShoppingCart, Users, Target } from 'lucide-react';
import { KpiCard } from './KpiCard';
import { formatCurrency, formatNumber } from '@/lib/formatters';
import type { KpiData } from '@/types';

interface KpiCardsProps {
  kpis: KpiData;
}

export function KpiCards({ kpis }: KpiCardsProps) {
  const cards = [
    {
      id: 'kpi-revenue',
      title: 'Total Revenue',
      value: kpis.totalRevenue,
      growth: kpis.revenueGrowth,
      icon: <IndianRupee className="w-4 h-4 text-indigo-400" aria-hidden="true" />,
      formatter: (v: number) => formatCurrency(v, true),
      color: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      id: 'kpi-orders',
      title: 'Total Orders',
      value: kpis.totalOrders,
      growth: kpis.ordersGrowth,
      icon: <ShoppingCart className="w-4 h-4 text-violet-400" aria-hidden="true" />,
      formatter: (v: number) => formatNumber(v),
      color: 'bg-violet-500/10 border-violet-500/20',
    },
    {
      id: 'kpi-leads',
      title: 'Active Leads',
      value: kpis.totalLeads,
      growth: kpis.leadsGrowth,
      icon: <Users className="w-4 h-4 text-sky-400" aria-hidden="true" />,
      formatter: (v: number) => formatNumber(v),
      color: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      id: 'kpi-strategies',
      title: 'Strategies',
      value: kpis.totalStrategies,
      growth: kpis.strategiesGrowth,
      icon: <Target className="w-4 h-4 text-amber-400" aria-hidden="true" />,
      formatter: (v: number) => formatNumber(v),
      color: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <section aria-label="Key Performance Indicators">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <KpiCard key={card.id} {...card} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}
