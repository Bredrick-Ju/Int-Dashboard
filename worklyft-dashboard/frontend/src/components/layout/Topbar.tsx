'use client';
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
      {/* App name – left side of header */}
      <div className="flex items-center gap-2 mr-auto">
        <span
          className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent select-none drop-shadow-sm"
          aria-label="Worklyft"
        >
          Worklyft
        </span>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-3">
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
