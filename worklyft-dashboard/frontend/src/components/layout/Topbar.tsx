'use client';

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Topbar.tsx
// ─────────────────────────────────────────────────────────────────────────────

import { Bell, Search, Wifi, WifiOff } from 'lucide-react';
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
      {/* Search */}
      <div className="relative flex-1 max-w-sm hidden md:flex items-center">
        <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          id="global-search"
          placeholder="Search…"
          aria-label="Global search"
          className="w-full h-8 bg-white/[0.04] border border-border rounded-lg pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
        />
        <kbd className="absolute right-3 text-[10px] font-mono text-muted-foreground bg-white/[0.04] border border-border rounded px-1.5 py-0.5 hidden sm:block">
          ⌘K
        </kbd>
      </div>

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

        {/* Notifications */}
        <button
          id="notifications-btn"
          aria-label="Notifications"
          className="relative flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-white/[0.04] transition-colors"
        >
          <Bell className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
        </button>

        {/* User Switcher */}
        <UserSwitcher />
      </div>
    </header>
  );
}
