'use client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import type { ChannelPerformanceItem } from '@/types';

interface Props { data: ChannelPerformanceItem[] }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card p-3 text-xs space-y-1 border-white/10">
      <p className="font-semibold text-foreground mb-1 max-w-[160px] truncate">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-4">
          <span className="text-muted-foreground capitalize">{p.name}</span>
          <span className="text-foreground font-medium">
            {p.name === 'revenue' || p.name === 'cost' ? formatCurrency(p.value, true) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function ChannelPerformanceChart({ data }: Props) {
  return (
    <div className="glass-card p-5" aria-label="Channel performance chart">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Channel Performance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Cost vs. revenue by channel</p>
        </div>
        <span className="text-[10px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-1 rounded-full font-medium">
          Horizontal Bar
        </span>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          barGap={4}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => formatCurrency(v, true)}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="cost" fill="#f59e0b" radius={[0, 4, 4, 0]} maxBarSize={14} fillOpacity={0.7} />
          <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 4, 4, 0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
