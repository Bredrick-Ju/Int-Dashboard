'use client';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { useAppStore, type AppUser } from '@/store/useAppStore';

const PERSONAS: ('aggressive' | 'steady' | 'early')[] = ['aggressive', 'steady', 'early'];

export function useUsers() {
  const { setUsers, setActiveUser, activeUser } = useAppStore();

  const query = useQuery<{ id: string; name: string; email: string }[]>({
    queryKey: ['users'],
    queryFn: () => api.users.getAll(),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!query.data) return;
    const appUsers: AppUser[] = query.data.map((u, i) => ({
      ...u,
      persona: PERSONAS[i] ?? 'steady',
    }));
    setUsers(appUsers);
    if (!activeUser && appUsers.length > 0) {
      setActiveUser(appUsers[0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data]);

  return query;
}
