export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type ActivityStatus = 'ACTIVE' | 'PENDING' | 'COMPLETED';
export type LeadStage = 'DRAFT' | 'CHEMISTRY' | 'SALES' | 'EVALUATION' | 'CLOSURE';
export type DeliveryStatus = 'PENDING' | 'IN_PROGRESS' | 'DELIVERED';

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  budget: number;
  targetRevenue: number;
  progress: number;
  startDate: string;
  endDate: string;
  metadata: Record<string, unknown>;
  channels?: Channel[];
}

export interface Channel {
  id: string;
  strategyId: string;
  name: string;
  cost: number;
  metadata: Record<string, unknown>;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  channelId: string;
  name: string;
  assignee: string;
  cost: number;
  status: ActivityStatus;
  startDate: string;
  endDate: string;
  leads?: Lead[];
}

export interface Lead {
  id: string;
  activityId: string;
  company: string;
  contactName: string;
  value: number;
  stage: LeadStage;
  status: string;
  orders?: Order[];
  activity?: { id: string; name: string; channelId: string };
}

export interface Order {
  id: string;
  leadId: string;
  value: number;
  paidAmount: number;
  deliveryStatus: DeliveryStatus;
  deliveryDate: string;
  lead?: { id: string; company: string; contactName: string };
}

export interface KpiData {
  totalRevenue: number;
  totalOrders: number;
  totalLeads: number;
  totalStrategies: number;
  revenueGrowth: number;
  ordersGrowth: number;
  leadsGrowth: number;
  strategiesGrowth: number;
}

export interface StrategyBudgetChartItem {
  name: string;
  budget: number;
  targetRevenue: number;
  progress: number;
}

export interface ChannelPerformanceItem {
  name: string;
  cost: number;
  leads: number;
  revenue: number;
}

export interface ActivityStatusItem {
  name: string;
  value: number;
  color: string;
}

export interface RevenueTrendItem {
  month: string;
  revenue: number;
  orders: number;
  leads: number;
}

export interface ChartData {
  strategyBudget: StrategyBudgetChartItem[];
  channelPerformance: ChannelPerformanceItem[];
  activityStatus: ActivityStatusItem[];
  revenueTrend: RevenueTrendItem[];
}

export interface RevenueSummary {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  averageOrderValue: number;
  deliveredOrders: number;
  inProgressOrders: number;
  pendingOrders: number;
}

export interface DashboardData {
  kpis: KpiData;
  strategies: Strategy[];
  channels: Channel[];
  activities: Activity[];
  leads: Lead[];
  orders: Order[];
  charts: ChartData;
  revenueSummary: RevenueSummary;
}
