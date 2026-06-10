'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, Rocket, TrendingUp, Sprout, Check } from 'lucide-react';
import { useState } from 'react';
import { useAppStore, type AppUser } from '@/store/useAppStore';
import { useUsers } from '@/hooks/useUsers';

import { cn } from '@/lib/utils';

const PERSONA_META = {
  aggressive: {
    label: 'Aggressive Growth',
    icon: Rocket,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    dot: 'bg-rose-400',
    ring: 'ring-rose-400',
  },
  steady: {
    label: 'Steady State',
    icon: TrendingUp,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20',
    dot: 'bg-indigo-400',
    ring: 'ring-indigo-400',
  },
  early: {
    label: 'Early Stage',
    icon: Sprout,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-400',
    ring: 'ring-emerald-400',
  },
};

export function UserSwitcher() {
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const { activeUser, users, setActiveUser, setIsTransitioning } = useAppStore();
  const queryClient = useQueryClient();
  useUsers();

  const handleSwitch = async (user: AppUser) => {
    if (user.id === activeUser?.id) { setOpen(false); return; }
    setOpen(false);
    setSwitching(true);
    setIsTransitioning(true);

    queryClient.invalidateQueries({ queryKey: ['dashboard', user.id] });
    setActiveUser(user);

    await new Promise((r) => setTimeout(r, 400));
    setIsTransitioning(false);
    setSwitching(false);
  };

  if (!activeUser) {
    return (
      <div className="skeleton h-9 w-48 rounded-lg" aria-label="Loading user switcher" />
    );
  }

  const meta = PERSONA_META[activeUser.persona];
  const ActiveIcon = meta.icon;

  return (
    <div className="relative" id="user-switcher">
      <motion.button
        id="user-switcher-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Switch active user"
        onClick={() => setOpen((v) => !v)}
        animate={switching ? { scale: [1, 0.96, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'flex items-center gap-2.5 h-9 px-3 rounded-lg border text-sm font-medium',
          'transition-all duration-200 hover:border-white/10 hover:bg-white/[0.04]',
          switching && 'ring-2 ring-offset-1 ring-offset-background',
          switching && meta.ring,
          meta.bg,
        )}
      >
        <span className={cn('w-2 h-2 rounded-full', meta.dot)} />
        <ActiveIcon className={cn('w-3.5 h-3.5', meta.color)} aria-hidden="true" />
        <span className="text-foreground">{activeUser.name}</span>
        <span className={cn('text-[10px] font-semibold', meta.color)}>{meta.label}</span>
        <ChevronDown
          className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

            <motion.div
              role="listbox"
              aria-label="Select user"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 top-11 z-50 w-72 rounded-xl border border-border bg-popover shadow-2xl overflow-hidden"
            >
              <div className="p-1.5">
                <p className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Switch User
                </p>
                {users.map((user) => {
                  const m = PERSONA_META[user.persona];
                  const UserIcon = m.icon;
                  const isActive = user.id === activeUser.id;
                  return (
                    <button
                      key={user.id}
                      role="option"
                      aria-selected={isActive}
                      id={`user-option-${user.id}`}
                      onClick={() => handleSwitch(user)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm',
                        'transition-all duration-150 hover:bg-white/[0.05] text-left',
                        isActive && 'bg-white/[0.04]',
                      )}
                    >
                      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center border', m.bg)}>
                        <UserIcon className={cn('w-4 h-4', m.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{user.name}</p>
                        <p className={cn('text-xs', m.color)}>{m.label}</p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
