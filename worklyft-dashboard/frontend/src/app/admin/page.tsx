'use client';

// ─────────────────────────────────────────────────────────────────────────────
// app/admin/page.tsx — Admin Control Center
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { api } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Shield, Plus, Activity, User, PlusCircle
} from 'lucide-react';
import type { LeadStage, ActivityStatus, DeliveryStatus } from '@/types';

export default function AdminPage() {
  const { activeUser } = useAppStore();
  const { data, isLoading } = useDashboard();
  const queryClient = useQueryClient();

  // Selected entities for controls
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedActivityId, setSelectedActivityId] = useState('');

  // New order form state
  const [orderValue, setOrderValue] = useState('15000');
  const [orderPaid, setOrderPaid] = useState('5000');
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('PENDING');

  // Mutations
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: LeadStage }) =>
      api.leads.updateStage(id, stage),
    onSuccess: () => {
      toast.success('Lead stage updated successfully');
      queryClient.invalidateQueries({ queryKey: ['dashboard', activeUser?.id] });
    },
    onError: (err) => {
      toast.error('Failed to update lead: ' + (err instanceof Error ? err.message : 'Unknown error'));
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ActivityStatus }) =>
      api.activities.updateStatus(id, status),
    onSuccess: () => {
      toast.success('Activity status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['dashboard', activeUser?.id] });
    },
    onError: (err) => {
      toast.error('Failed to update activity: ' + (err instanceof Error ? err.message : 'Unknown error'));
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (newOrder: {
      leadId: string;
      value: number;
      paidAmount: number;
      deliveryStatus: DeliveryStatus;
      deliveryDate: string;
    }) => api.orders.create(newOrder),
    onSuccess: () => {
      toast.success('Order created successfully and synced!');
      queryClient.invalidateQueries({ queryKey: ['dashboard', activeUser?.id] });
      // Reset order value / paid amount forms
      setOrderValue('15000');
      setOrderPaid('5000');
    },
    onError: (err) => {
      toast.error('Failed to create order: ' + (err instanceof Error ? err.message : 'Unknown error'));
    },
  });

  const handleUpdateLeadStage = (stage: LeadStage) => {
    if (!selectedLeadId) {
      toast.warning('Please select a lead first');
      return;
    }
    updateLeadMutation.mutate({ id: selectedLeadId, stage });
  };

  const handleUpdateActivityStatus = (status: ActivityStatus) => {
    if (!selectedActivityId) {
      toast.warning('Please select an activity first');
      return;
    }
    updateActivityMutation.mutate({ id: selectedActivityId, status });
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) {
      toast.warning('Please select a lead first');
      return;
    }
    const val = parseFloat(orderValue);
    const paid = parseFloat(orderPaid);

    if (isNaN(val) || val <= 0) {
      toast.warning('Please enter a valid order value');
      return;
    }
    if (isNaN(paid) || paid < 0 || paid > val) {
      toast.warning('Paid amount must be between 0 and the total order value');
      return;
    }

    createOrderMutation.mutate({
      leadId: selectedLeadId,
      value: val,
      paidAmount: paid,
      deliveryStatus,
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="skeleton h-12 w-64 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="skeleton h-80 rounded-xl animate-pulse" />
            <div className="skeleton h-80 rounded-xl animate-pulse" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const leads = data?.leads || [];
  const activities = data?.activities || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Admin Operations & Testing Console</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Simulate events, update workflows, and trigger real-time WebSocket room broadcasts
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-semibold">
            <Shield className="w-3.5 h-3.5" />
            Admin Authorized
          </div>
        </div>

        {/* Console Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Stage Simulator */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-foreground">Lead Stage Simulator</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Select a client lead associated with the active user and instantly push them to a different pipeline stage.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="lead-select" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Select Lead
                </label>
                <select
                  id="lead-select"
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full text-xs bg-black border border-sky-500/50 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-400 transition-colors"
                >
                  <option value="" className="bg-black text-white">-- Choose a lead --</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id} className="bg-black text-white">
                      {l.company} - {l.contactName} ({formatCurrency(l.value, true)}) [{l.stage}]
                    </option>
                  ))}
                </select>
              </div>

              {selectedLeadId && (
                <div>
                  <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Push to Stage
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {(['DRAFT', 'CHEMISTRY', 'SALES', 'EVALUATION', 'CLOSURE'] as LeadStage[]).map((stage) => (
                      <button
                        key={stage}
                        type="button"
                        onClick={() => handleUpdateLeadStage(stage)}
                        disabled={updateLeadMutation.isPending}
                        className="px-2 py-1.5 text-[10px] font-medium border border-border bg-white/[0.02] hover:bg-white/[0.06] active:bg-white/[0.04] text-foreground rounded-md transition-colors truncate"
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Marketing & Sales Activity Toggle */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-semibold text-foreground">Marketing & Sales Activity Toggle</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Select a channel activity (e.g. Campaign, Ad Set, Pitch Deck) and update its operational state.
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="activity-select" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Select Activity
                </label>
                <select
                  id="activity-select"
                  value={selectedActivityId}
                  onChange={(e) => setSelectedActivityId(e.target.value)}
                  className="w-full text-xs bg-black border border-sky-500/50 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-400 transition-colors"
                >
                  <option value="" className="bg-black text-white">-- Choose an activity --</option>
                  {activities.map((a) => (
                    <option key={a.id} value={a.id} className="bg-black text-white">
                      {a.name} (Cost: {formatCurrency(a.cost)}) [{a.status}]
                    </option>
                  ))}
                </select>
              </div>

              {selectedActivityId && (
                <div>
                  <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Update Status
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(['PENDING', 'ACTIVE', 'COMPLETED'] as ActivityStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleUpdateActivityStatus(status)}
                        disabled={updateActivityMutation.isPending}
                        className="px-2 py-2 text-[10px] font-semibold border border-border bg-white/[0.02] hover:bg-white/[0.06] text-foreground rounded-md transition-colors"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Realization Simulator - spans full width */}
          <div className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-semibold text-foreground">Order Realization Simulator</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Create a finalized commercial contract (order) for the selected lead, contributing to total contract value.
            </p>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label htmlFor="lead-order-select" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Select Target Lead
                </label>
                <select
                  id="lead-order-select"
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full text-xs bg-black border border-sky-500/50 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-400 transition-colors"
                >
                  <option value="" className="bg-black text-white">-- Choose a lead --</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id} className="bg-black text-white">
                      {l.company} ({formatCurrency(l.value, true)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="order-value" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Contract Value (₹)
                  </label>
                  <input
                    id="order-value"
                    type="number"
                    value={orderValue}
                    onChange={(e) => setOrderValue(e.target.value)}
                    className="w-full text-xs bg-white/[0.03] border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="order-paid" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Amount Paid (₹)
                  </label>
                  <input
                    id="order-paid"
                    type="number"
                    value={orderPaid}
                    onChange={(e) => setOrderPaid(e.target.value)}
                    className="w-full text-xs bg-white/[0.03] border border-border rounded-lg p-2.5 text-foreground focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="delivery-status" className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Fulfillment Status
                  </label>
                  <select
                    id="delivery-status"
                    value={deliveryStatus}
                    onChange={(e) => setDeliveryStatus(e.target.value as DeliveryStatus)}
                    className="w-full text-xs bg-black border border-sky-500/50 rounded-lg p-2.5 text-white focus:outline-none focus:border-sky-400 transition-colors"
                  >
                    <option value="PENDING" className="bg-black text-white">Pending</option>
                    <option value="IN_PROGRESS" className="bg-black text-white">In Progress</option>
                    <option value="DELIVERED" className="bg-black text-white">Delivered</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={createOrderMutation.isPending || !selectedLeadId}
                    className={cn(
                      'w-full flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 transition-all',
                      !selectedLeadId && 'opacity-50 cursor-not-allowed bg-emerald-500/50'
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    Commit Contract
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
