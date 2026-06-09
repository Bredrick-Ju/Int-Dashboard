'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/dashboard/StrategyBudgetChart.tsx — Grouped bar chart
// ─────────────────────────────────────────────────────────────────────────────

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import type { StrategyBudgetChartItem } from '@/types';

interface Props { data: StrategyBudgetChartItem[] }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs space-y-1 border-white/10">
      <p className="font-semibold text-foreground mb-1.5 max-w-[180px] truncate">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4 text-muted-foreground">
          <span className="capitalize">{p.name}</span>
          <span className="text-foreground font-medium">{formatCurrency(p.value, true)}</span>
        </div>
      ))}
    </div>
  );
};

export function StrategyBudgetChart({ data }: Props) {
  return (
    <div className="glass-card p-5" aria-label="Strategy budget vs target chart">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Strategy Budget vs Target</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Allocation & revenue targets</p>
        </div>
        <span className="text-[10px] text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-1 rounded-full font-medium">
          Bar Chart
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 8, right: 4, left: 10, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrency(v, true)} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="budget" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={28}>
            {data.map((_, i) => (
              <Cell key={i} fill={`hsl(${239 + i * 15}, 84%, ${65 - i * 3}%)`} />
            ))}
          </Bar>
          <Bar dataKey="targetRevenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={28} fillOpacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
      {/* Progress bars */}
      <div className="mt-4 space-y-2">
        {data.map((s) => (
          <div key={s.name} className="flex items-center gap-2 text-xs">
            <span className="w-28 truncate text-muted-foreground">{s.name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                style={{ width: `${Math.min(s.progress, 100)}%` }}
              />
            </div>
            <span className="w-8 text-right text-muted-foreground">{s.progress.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
