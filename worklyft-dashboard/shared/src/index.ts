// ─────────────────────────────────────────────────────────────────────────────
// Shared Types — Worklyft Real-Time Revenue Operations Dashboard
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum ActivityStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum LeadStage {
  DRAFT = 'DRAFT',
  CHEMISTRY = 'CHEMISTRY',
  SALES = 'SALES',
  EVALUATION = 'EVALUATION',
  CLOSURE = 'CLOSURE',
}

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Strategy ────────────────────────────────────────────────────────────────

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

// ─── Channel ─────────────────────────────────────────────────────────────────

export interface Channel {
  id: string;
  strategyId: string;
  name: string;
  cost: number;
  metadata: Record<string, unknown>;
  activities?: Activity[];
}

// ─── Activity ────────────────────────────────────────────────────────────────

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

// ─── Lead ────────────────────────────────────────────────────────────────────

export interface Lead {
  id: string;
  activityId: string;
  company: string;
  contactName: string;
  value: number;
  stage: LeadStage;
  status: string;
  orders?: Order[];
  activity?: Pick<Activity, 'id' | 'name' | 'channelId'>;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  leadId: string;
  value: number;
  paidAmount: number;
  deliveryStatus: DeliveryStatus;
  deliveryDate: string;
  lead?: Pick<Lead, 'id' | 'company' | 'contactName'>;
}

// ─── KPI ─────────────────────────────────────────────────────────────────────

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

// ─── Chart Data ───────────────────────────────────────────────────────────────

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

// ─── Revenue Summary ─────────────────────────────────────────────────────────

export interface RevenueSummary {
  totalRevenue: number;
  totalPaid: number;
  totalPending: number;
  averageOrderValue: number;
  deliveredOrders: number;
  inProgressOrders: number;
  pendingOrders: number;
}

// ─── Dashboard Response ───────────────────────────────────────────────────────

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

// ─── Socket Events ────────────────────────────────────────────────────────────

export interface SocketLeadUpdatedPayload {
  leadId: string;
  userId: string;
  previousStage: LeadStage;
  newStage: LeadStage;
  lead: Lead;
}

export interface SocketOrderCreatedPayload {
  orderId: string;
  userId: string;
  order: Order;
}

export interface SocketActivityUpdatedPayload {
  activityId: string;
  userId: string;
  previousStatus: ActivityStatus;
  newStatus: ActivityStatus;
  activity: Activity;
}

export interface SocketDashboardUpdatedPayload {
  userId: string;
  updatedAt: string;
}

export type SocketEventPayload =
  | SocketLeadUpdatedPayload
  | SocketOrderCreatedPayload
  | SocketActivityUpdatedPayload
  | SocketDashboardUpdatedPayload;

export enum SocketEvents {
  LEAD_UPDATED = 'lead.updated',
  ORDER_CREATED = 'order.created',
  ACTIVITY_UPDATED = 'activity.updated',
  DASHBOARD_UPDATED = 'dashboard.updated',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
}

// ─── API DTOs ─────────────────────────────────────────────────────────────────

export interface UpdateLeadStageDto {
  stage: LeadStage;
}

export interface CreateOrderDto {
  leadId: string;
  value: number;
  paidAmount: number;
  deliveryStatus: DeliveryStatus;
  deliveryDate: string;
}

export interface UpdateActivityStatusDto {
  status: ActivityStatus;
}
