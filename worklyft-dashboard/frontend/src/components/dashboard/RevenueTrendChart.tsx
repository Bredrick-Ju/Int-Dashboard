'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/dashboard/RevenueTrendChart.tsx — Area chart
// ─────────────────────────────────────────────────────────────────────────────

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import type { RevenueTrendItem } from '@/types';

interface Props { data: RevenueTrendItem[] }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs space-y-1.5 border-white/10">
      <p className="font-semibold text-foreground mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground capitalize">{p.name}</span>
          </span>
          <span className="font-medium text-foreground">
            {p.name === 'revenue' ? formatCurrency(p.value, true) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function RevenueTrendChart({ data }: Props) {
  return (
    <div className="glass-card p-5" aria-label="Revenue trend chart">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Revenue Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 6 months performance</p>
        </div>
        <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded-full font-medium">
          Area Chart
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: '#64748b', paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#6366f1' }} />
          <Area type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} fill="url(#ordGrad)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
