// ─────────────────────────────────────────────────────────────────────────────
// store/useAppStore.ts — Global Zustand App Store
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  persona: 'aggressive' | 'steady' | 'early';
}

interface AppState {
  activeUser: AppUser | null;
  users: AppUser[];
  socketConnected: boolean;
  socketRoom: string | null;
  isTransitioning: boolean;

  setUsers: (users: AppUser[]) => void;
  setActiveUser: (user: AppUser) => void;
  setSocketConnected: (connected: boolean) => void;
  setSocketRoom: (room: string | null) => void;
  setIsTransitioning: (v: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      activeUser: null,
      users: [],
      socketConnected: false,
      socketRoom: null,
      isTransitioning: false,

      setUsers: (users) => set({ users }),
      setActiveUser: (user) => set({ activeUser: user }),
      setSocketConnected: (connected) => set({ socketConnected: connected }),
      setSocketRoom: (room) => set({ socketRoom: room }),
      setIsTransitioning: (v) => set({ isTransitioning: v }),
    }),
    { name: 'worklyft-app-store' },
  ),
);
