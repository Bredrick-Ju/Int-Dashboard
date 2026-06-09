'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/dashboard/AnimatedNumber.tsx — Reusable counting animation
// ─────────────────────────────────────────────────────────────────────────────

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedNumberProps {
  /** The target numeric value to animate to */
  value: number;
  /** Formats the intermediate/final value for display */
  formatter?: (v: number) => string;
  /** Animation duration in seconds (default: 1.2) */
  duration?: number;
  /** CSS class applied to the wrapping <motion.span> */
  className?: string;
}

/**
 * Counts up from 0 to `value` on mount (and whenever `value` changes).
 * The formatter receives a Math.round()'d intermediate value so currency /
 * percentage strings stay clean during the animation.
 */
export function AnimatedNumber({
  value,
  formatter = (v) => String(v),
  duration = 1.2,
  className,
}: AnimatedNumberProps) {
  const motionVal = useMotionValue(0);
  const displayed = useTransform(motionVal, (v) => formatter(Math.round(v)));

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [value, motionVal, duration]);

  return <motion.span className={className}>{displayed}</motion.span>;
}
