'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/dashboard/ActivityStatusDonut.tsx — Donut chart
// ─────────────────────────────────────────────────────────────────────────────

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { ActivityStatusItem } from '@/types';

interface Props { data: ActivityStatusItem[] }

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {(percent * 100).toFixed(0)}%
    </text>
  );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: ActivityStatusItem }[] }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="glass-card px-3 py-2 text-xs border-white/10">
      <p className="font-semibold" style={{ color: p.payload.color }}>{p.name}</p>
      <p className="text-muted-foreground">{p.value} activities</p>
    </div>
  );
};

export function ActivityStatusDonut({ data }: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="glass-card p-5" aria-label="Activity status donut chart">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Activity Status</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{total} total activities</p>
        </div>
        <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full font-medium">
          Donut
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: '#64748b', paddingTop: 8 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
