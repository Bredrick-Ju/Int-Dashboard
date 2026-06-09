'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import type { DashboardData } from '@/types';

export function useDashboard() {
  const { activeUser } = useAppStore();
  const queryClient = useQueryClient();

  const query = useQuery<DashboardData>({
    queryKey: ['dashboard', activeUser?.id],
    queryFn: () => api.dashboard.getByUser(activeUser!.id),
    enabled: !!activeUser?.id,
    staleTime: 30_000,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard', activeUser?.id] });
  };

  return { ...query, invalidate };
}
