'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Topbar.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { Wifi, WifiOff } from 'lucide-react';
import { UserSwitcher } from './UserSwitcher';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export function Topbar() {
  const { socketConnected } = useAppStore();

  return (
    <header
      className="h-14 flex items-center gap-4 px-6 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-30"
      role="banner"
    >
      <div className="flex items-center gap-3 ml-auto">
        {/* WebSocket status */}
        <div
          className={cn(
            'flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium',
            socketConnected
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : 'text-rose-400 bg-rose-500/10 border-rose-500/20',
          )}
          aria-label={socketConnected ? 'WebSocket connected' : 'WebSocket disconnected'}
          role="status"
        >
          {socketConnected ? (
            <Wifi className="w-3 h-3" aria-hidden="true" />
          ) : (
            <WifiOff className="w-3 h-3" aria-hidden="true" />
          )}
          <span className="hidden sm:inline">
            {socketConnected ? 'Live' : 'Offline'}
          </span>
        </div>

        {/* User Switcher */}
        <UserSwitcher />
      </div>
    </header>
  );
}
