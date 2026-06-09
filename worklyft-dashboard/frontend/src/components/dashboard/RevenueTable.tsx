'use client';
import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronDown, Filter, IndianRupee } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { Order, Lead } from '@/types';

interface RevenueTableProps {
  orders: Order[];
  leads: Lead[];
}

type SortField = 'value' | 'paidAmount' | 'deliveryDate';
type SortOrder = 'asc' | 'desc';

export function RevenueTable({ orders, leads }: RevenueTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'DELIVERED'>('ALL');
  const [sortField, setSortField] = useState<SortField>('deliveryDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const leadMap = useMemo(() => {
    return new Map(leads.map((l) => [l.id, l]));
  }, [leads]);

  const processedOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const lead = leadMap.get(order.leadId);
        const company = lead?.company?.toLowerCase() || '';
        const contact = lead?.contactName?.toLowerCase() || '';
        const searchLower = search.toLowerCase();
        
        const matchesSearch =
          company.includes(searchLower) ||
          contact.includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower);

        const matchesStatus =
          statusFilter === 'ALL' || order.deliveryStatus === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (sortField === 'deliveryDate') {
          valA = new Date(a.deliveryDate).getTime();
          valB = new Date(b.deliveryDate).getTime();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [orders, leadMap, search, statusFilter, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getStatusBadge = (status: Order['deliveryStatus']) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Delivered
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            In Progress
          </span>
        );
      case 'PENDING':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-card p-6" role="region" aria-label="Orders ledger">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-semibold text-foreground">Orders Ledger</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Historical breakdown and delivery pipeline</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 w-60 text-xs bg-white/[0.03] border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Filter dropdown */}
          <div className="relative flex items-center gap-1.5 bg-white/[0.03] border border-border rounded-lg px-3 py-1.5 text-xs text-foreground cursor-pointer hover:border-white/10 transition-colors">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent border-none outline-none cursor-pointer pr-4 appearance-none"
            >
              <option value="ALL" className="bg-popover text-foreground">All Deliveries</option>
              <option value="PENDING" className="bg-popover text-foreground">Pending</option>
              <option value="IN_PROGRESS" className="bg-popover text-foreground">In Progress</option>
              <option value="DELIVERED" className="bg-popover text-foreground">Delivered</option>
            </select>
            <ChevronDown className="absolute right-2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border/50 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="pb-3 pl-2">Order ID</th>
              <th className="pb-3">Client Company</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort('value')}>
                <div className="flex items-center gap-1">
                  Order Value
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="pb-3 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort('paidAmount')}>
                <div className="flex items-center gap-1">
                  Amount Paid
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
              <th className="pb-3">Delivery Status</th>
              <th className="pb-3 pl-2 cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort('deliveryDate')}>
                <div className="flex items-center gap-1">
                  Delivery Date
                  <ArrowUpDown className="w-3.5 h-3.5" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30 text-xs">
            {processedOrders.map((order) => {
              const lead = leadMap.get(order.leadId);
              return (
                <tr key={order.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-3.5 pl-2 font-mono text-[10px] text-muted-foreground">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="py-3.5 font-medium text-foreground">
                    {lead?.company || 'Unknown Company'}
                  </td>
                  <td className="py-3.5 text-muted-foreground">
                    {lead?.contactName || 'N/A'}
                  </td>
                  <td className="py-3.5 font-semibold text-foreground">
                    {formatCurrency(order.value)}
                  </td>
                  <td className="py-3.5 font-medium text-emerald-400/90">
                    {formatCurrency(order.paidAmount)}
                  </td>
                  <td className="py-3.5">
                    {getStatusBadge(order.deliveryStatus)}
                  </td>
                  <td className="py-3.5 text-muted-foreground pl-2">
                    {formatDate(order.deliveryDate)}
                  </td>
                </tr>
              );
            })}

            {processedOrders.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-muted-foreground text-xs">
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
