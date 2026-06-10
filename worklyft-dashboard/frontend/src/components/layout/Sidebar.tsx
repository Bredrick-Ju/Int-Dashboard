'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  LayoutDashboard,
  BarChart3,
  IndianRupee,
  Settings2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Revenue', href: '/revenue', icon: IndianRupee },
  { label: 'Admin', href: '/admin', icon: Settings2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Sidebar navigation"
      className="flex flex-col h-full w-60 border-r border-border bg-sidebar px-3 py-4"
    >
      {/* Logo – centered, bigger, no text */}
      <div className="flex justify-center px-2 mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/30 shrink-0">
          <Image
            src="/assets/logo.jpeg"
            alt="Worklyft logo"
            width={64}
            height={64}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1" role="navigation">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          Menu
        </p>
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              id={`nav-${label.toLowerCase()}`}
              aria-current={isActive ? 'page' : undefined}
              className={cn('nav-item', isActive && 'active')}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              {label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-border">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-muted-foreground">Developed by Bredrick</span>
        </div>
      </div>
    </aside>
  );
}
