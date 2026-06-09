'use client';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  formatter?: (v: number) => string;
  duration?: number;
  className?: string;
}

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
