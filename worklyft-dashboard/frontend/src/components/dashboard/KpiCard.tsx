'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/dashboard/KpiCard.tsx — Single animated KPI card
// ─────────────────────────────────────────────────────────────────────────────

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  id: string;
  title: string;
  value: number;
  growth: number;
  icon: React.ReactNode;
  formatter: (v: number) => string;
  color: string;
  delay?: number;
}

function AnimatedNumber({ value, formatter }: { value: number; formatter: (v: number) => string }) {
  const motionVal = useMotionValue(0);
  const displayed = useTransform(motionVal, (v) => formatter(Math.round(v)));

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.2,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [value, motionVal]);

  return <motion.span>{displayed}</motion.span>;
}

export function KpiCard({ id, title, value, growth, icon, formatter, color, delay = 0 }: KpiCardProps) {
  const isPositive = growth >= 0;

  return (
    <motion.div
      id={id}
      role="article"
      aria-label={`${title}: ${formatter(value)}`}
      className="kpi-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-lg border',
            color,
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
        <div
          className={cn(
            'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
            isPositive
              ? 'text-emerald-400 bg-emerald-500/10'
              : 'text-rose-400 bg-rose-500/10',
          )}
          aria-label={`${isPositive ? 'Increase' : 'Decrease'} of ${Math.abs(growth)}%`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(growth).toFixed(1)}%
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground tracking-tight">
        <AnimatedNumber value={value} formatter={formatter} />
      </p>
    </motion.div>
  );
}
