// ─────────────────────────────────────────────────────────────────────────────
// lib/api.ts — Axios API client
// ─────────────────────────────────────────────────────────────────────────────

import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Response interceptor — unwrap { success, data } envelope
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && 'data' in response.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => Promise.reject(error),
);

// ─── API Functions ────────────────────────────────────────────────────────────

export const api = {
  users: {
    getAll: () => apiClient.get('/users').then((r) => r.data),
  },
  dashboard: {
    getByUser: (userId: string) =>
      apiClient.get(`/dashboard/${userId}`).then((r) => r.data),
  },
  leads: {
    getByUser: (userId: string) =>
      apiClient.get(`/leads/${userId}`).then((r) => r.data),
    updateStage: (id: string, stage: string) =>
      apiClient.patch(`/leads/${id}/stage`, { stage }).then((r) => r.data),
  },
  orders: {
    getByUser: (userId: string) =>
      apiClient.get(`/orders/${userId}`).then((r) => r.data),
    create: (data: {
      leadId: string;
      value: number;
      paidAmount: number;
      deliveryStatus: string;
      deliveryDate: string;
    }) => apiClient.post('/orders', data).then((r) => r.data),
  },
  activities: {
    getByUser: (userId: string) =>
      apiClient.get(`/activities/${userId}`).then((r) => r.data),
    updateStatus: (id: string, status: string) =>
      apiClient.patch(`/activities/${id}/status`, { status }).then((r) => r.data),
  },
};
