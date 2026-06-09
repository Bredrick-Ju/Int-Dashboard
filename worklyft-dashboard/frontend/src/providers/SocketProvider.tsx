'use client';

// ─────────────────────────────────────────────────────────────────────────────
// providers/SocketProvider.tsx — Socket.io Context + Real-time event handlers
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getSocket, joinUserRoom, leaveUserRoom } from '@/lib/socket';
import { useAppStore } from '@/store/useAppStore';

interface SocketContextValue {
  switchRoom: (oldUserId: string | null, newUserId: string) => void;
}

const SocketContext = createContext<SocketContextValue>({
  switchRoom: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const { activeUser, setSocketConnected } = useAppStore();
  const prevUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const socket = getSocket();

    const onConnect = () => {
      setSocketConnected(true);
      // Re-join room on reconnect
      if (activeUser) joinUserRoom(activeUser.id);
    };
    const onDisconnect = () => setSocketConnected(false);

    const onLeadUpdated = (payload: { lead: { company: string }; newStage: string }) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead Updated', {
        description: `${payload.lead.company} moved to ${payload.newStage}`,
        duration: 4000,
      });
    };

    const onOrderCreated = (payload: { order: { value: number; lead: { company: string } } }) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order Created', {
        description: `New order for ${payload.order.lead?.company ?? 'unknown'} — ₹${payload.order.value.toLocaleString('en-IN')}`,
        duration: 4000,
      });
    };

    const onActivityUpdated = (payload: { activity: { name: string }; newStatus: string }) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.info('Activity Updated', {
        description: `${payload.activity.name} → ${payload.newStatus}`,
        duration: 4000,
      });
    };

    const onDashboardUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('lead.updated', onLeadUpdated);
    socket.on('order.created', onOrderCreated);
    socket.on('activity.updated', onActivityUpdated);
    socket.on('dashboard.updated', onDashboardUpdated);

    if (socket.connected) setSocketConnected(true);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('lead.updated', onLeadUpdated);
      socket.off('order.created', onOrderCreated);
      socket.off('activity.updated', onActivityUpdated);
      socket.off('dashboard.updated', onDashboardUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Join/leave rooms when activeUser changes
  useEffect(() => {
    if (!activeUser) return;
    const prev = prevUserIdRef.current;
    if (prev && prev !== activeUser.id) leaveUserRoom(prev);
    joinUserRoom(activeUser.id);
    prevUserIdRef.current = activeUser.id;
  }, [activeUser]);

  const switchRoom = (oldUserId: string | null, newUserId: string) => {
    if (oldUserId) leaveUserRoom(oldUserId);
    joinUserRoom(newUserId);
  };

  return (
    <SocketContext.Provider value={{ switchRoom }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);
