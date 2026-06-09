// ─────────────────────────────────────────────────────────────────────────────
// Prisma Seed — Worklyft Real-Time Revenue Operations Dashboard
// ─────────────────────────────────────────────────────────────────────────────
// Three distinct user personas:
//   User A — Aggressive Growth: high budget, high volume, high revenue
//   User B — Steady State: balanced pipeline, moderate revenue
//   User C — Early Stage: small budget, few leads, minimal orders
// ─────────────────────────────────────────────────────────────────────────────

import {
  PrismaClient,
  ActivityStatus,
  LeadStage,
  DeliveryStatus,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Worklyft database...');

  // Clean existing data
  await prisma.order.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.channel.deleteMany();
  await prisma.strategy.deleteMany();
  await prisma.user.deleteMany();

  // ─── User A: Aggressive Growth ───────────────────────────────────────────

  const userA = await prisma.user.create({
    data: {
      name: 'Ashwin',
      email: 'marcus@aggressivegrowth.io',
    },
  });

  const stratA1 = await prisma.strategy.create({
    data: {
      userId: userA.id,
      name: 'Enterprise Domination Q3',
      budget: 850000,
      targetRevenue: 4200000,
      progress: 78,
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-09-30'),
      metadata: { priority: 'critical', region: 'North America', tier: 'enterprise' },
    },
  });

  const stratA2 = await prisma.strategy.create({
    data: {
      userId: userA.id,
      name: 'APAC Market Penetration',
      budget: 620000,
      targetRevenue: 2800000,
      progress: 62,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-31'),
      metadata: { priority: 'high', region: 'APAC', tier: 'mid-market' },
    },
  });

  const stratA3 = await prisma.strategy.create({
    data: {
      userId: userA.id,
      name: 'SMB Velocity Campaign',
      budget: 340000,
      targetRevenue: 1600000,
      progress: 91,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-06-30'),
      metadata: { priority: 'medium', region: 'Global', tier: 'smb' },
    },
  });

  // Channels for Strategy A1
  const chanA1_1 = await prisma.channel.create({
    data: {
      strategyId: stratA1.id,
      name: 'Paid Search (Google/Bing)',
      cost: 180000,
      metadata: { platform: 'Google Ads', impressions: 4200000, ctr: 3.8 },
    },
  });

  const chanA1_2 = await prisma.channel.create({
    data: {
      strategyId: stratA1.id,
      name: 'LinkedIn Enterprise ABM',
      cost: 245000,
      metadata: { platform: 'LinkedIn', accounts: 280, engagementRate: 12.4 },
    },
  });

  const chanA1_3 = await prisma.channel.create({
    data: {
      strategyId: stratA1.id,
      name: 'Field Sales Events',
      cost: 125000,
      metadata: { events: 12, attendees: 3400, nps: 72 },
    },
  });

  // Channels for Strategy A2
  const chanA2_1 = await prisma.channel.create({
    data: {
      strategyId: stratA2.id,
      name: 'Partner Channel Asia',
      cost: 210000,
      metadata: { partners: 18, region: 'SEA, ANZ, JP' },
    },
  });

  const chanA2_2 = await prisma.channel.create({
    data: {
      strategyId: stratA2.id,
      name: 'Content & SEO',
      cost: 95000,
      metadata: { articles: 84, organicTraffic: 182000, rankingKeywords: 1240 },
    },
  });

  // Channels for Strategy A3
  const chanA3_1 = await prisma.channel.create({
    data: {
      strategyId: stratA3.id,
      name: 'Product-Led Growth',
      cost: 65000,
      metadata: { trials: 8400, conversionRate: 22.4, mrr: 124000 },
    },
  });

  const chanA3_2 = await prisma.channel.create({
    data: {
      strategyId: stratA3.id,
      name: 'Email Automation',
      cost: 28000,
      metadata: { sequences: 24, openRate: 34.2, clickRate: 8.6 },
    },
  });

  // Activities for Channel A1_1
  const actA1_1_1 = await prisma.activity.create({
    data: {
      channelId: chanA1_1.id,
      name: 'Q3 Enterprise Keyword Campaign',
      assignee: 'Sofia Chen',
      cost: 95000,
      status: ActivityStatus.ACTIVE,
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-09-30'),
    },
  });

  const actA1_1_2 = await prisma.activity.create({
    data: {
      channelId: chanA1_1.id,
      name: 'Retargeting Sequence - Enterprise',
      assignee: 'James Park',
      cost: 45000,
      status: ActivityStatus.ACTIVE,
      startDate: new Date('2025-07-15'),
      endDate: new Date('2025-09-15'),
    },
  });

  // Activities for Channel A1_2
  const actA1_2_1 = await prisma.activity.create({
    data: {
      channelId: chanA1_2.id,
      name: 'ABM Tier-1 Account Outreach',
      assignee: 'Elena Vasquez',
      cost: 120000,
      status: ActivityStatus.ACTIVE,
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-09-30'),
    },
  });

  const actA1_2_2 = await prisma.activity.create({
    data: {
      channelId: chanA1_2.id,
      name: 'LinkedIn Thought Leadership Series',
      assignee: 'David Kim',
      cost: 55000,
      status: ActivityStatus.COMPLETED,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-07-31'),
    },
  });

  // Activities for Channel A1_3
  const actA1_3_1 = await prisma.activity.create({
    data: {
      channelId: chanA1_3.id,
      name: 'Gartner Summit Presence',
      assignee: 'Ashwin',
      cost: 85000,
      status: ActivityStatus.COMPLETED,
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-05-15'),
    },
  });

  // Activities for Channel A2_1
  const actA2_1_1 = await prisma.activity.create({
    data: {
      channelId: chanA2_1.id,
      name: 'Southeast Asia Partner Enablement',
      assignee: 'Priya Nair',
      cost: 110000,
      status: ActivityStatus.ACTIVE,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-11-30'),
    },
  });

  // Activities for Channel A2_2
  const actA2_2_1 = await prisma.activity.create({
    data: {
      channelId: chanA2_2.id,
      name: 'APAC Industry Content Program',
      assignee: 'Wei Zhang',
      cost: 45000,
      status: ActivityStatus.ACTIVE,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-31'),
    },
  });

  // Activities for Channel A3_1
  const actA3_1_1 = await prisma.activity.create({
    data: {
      channelId: chanA3_1.id,
      name: 'Freemium to Paid Nurture Flow',
      assignee: 'Alex Turner',
      cost: 35000,
      status: ActivityStatus.COMPLETED,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-06-15'),
    },
  });

  // Activities for Channel A3_2
  const actA3_2_1 = await prisma.activity.create({
    data: {
      channelId: chanA3_2.id,
      name: 'Onboarding Email Optimization',
      assignee: 'Nina Patel',
      cost: 18000,
      status: ActivityStatus.PENDING,
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-09-30'),
    },
  });

  // Leads for User A activities
  const leadsA = await Promise.all([
    // Enterprise leads (high value, various stages)
    prisma.lead.create({ data: { activityId: actA1_1_1.id, company: 'Apex Financial Corp', contactName: 'Sarah Mitchell', value: 420000, stage: LeadStage.CLOSURE, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA1_1_1.id, company: 'GlobalTech Systems', contactName: 'Robert Chang', value: 380000, stage: LeadStage.EVALUATION, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA1_1_1.id, company: 'Meridian Healthcare', contactName: 'Dr. James Okonkwo', value: 295000, stage: LeadStage.SALES, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA1_1_2.id, company: 'Vantage Logistics', contactName: 'Amanda Foster', value: 185000, stage: LeadStage.CHEMISTRY, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA1_1_2.id, company: 'NexGen Manufacturing', contactName: 'Carlos Rivera', value: 240000, stage: LeadStage.EVALUATION, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA1_2_1.id, company: 'Pinnacle Insurance Group', contactName: 'Jennifer Walsh', value: 520000, stage: LeadStage.CLOSURE, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA1_2_1.id, company: 'Stellar Energy Corp', contactName: 'Michael Torres', value: 310000, stage: LeadStage.SALES, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA1_2_1.id, company: 'Quantum Retail Holdings', contactName: 'Lisa Park', value: 175000, stage: LeadStage.DRAFT, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA1_2_2.id, company: 'TechVision AI', contactName: 'Ryan Blackwood', value: 88000, stage: LeadStage.CHEMISTRY, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA1_3_1.id, company: 'Cascade Biotech', contactName: 'Dr. Amelia Santos', value: 430000, stage: LeadStage.EVALUATION, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA2_1_1.id, company: 'AsiaPac Holdings', contactName: 'Kevin Tan', value: 280000, stage: LeadStage.SALES, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA2_1_1.id, company: 'Dragon Fintech', contactName: 'Mei Liang', value: 195000, stage: LeadStage.CHEMISTRY, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA2_2_1.id, company: 'Pacific Commerce Co', contactName: 'Thomas Nguyen', value: 145000, stage: LeadStage.DRAFT, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA3_1_1.id, company: 'StartSmart Inc', contactName: 'Zoe Harrison', value: 24000, stage: LeadStage.CLOSURE, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA3_1_1.id, company: 'CodeBase Labs', contactName: 'Dev Patel', value: 18000, stage: LeadStage.SALES, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actA3_2_1.id, company: 'PixelFlow Agency', contactName: 'Emma Wilson', value: 12000, stage: LeadStage.EVALUATION, status: 'open' } }),
  ]);

  // Orders for User A
  await Promise.all([
    prisma.order.create({ data: { leadId: leadsA[0].id, value: 420000, paidAmount: 420000, deliveryStatus: DeliveryStatus.DELIVERED, deliveryDate: new Date('2025-08-15') } }),
    prisma.order.create({ data: { leadId: leadsA[5].id, value: 520000, paidAmount: 260000, deliveryStatus: DeliveryStatus.IN_PROGRESS, deliveryDate: new Date('2025-10-01') } }),
    prisma.order.create({ data: { leadId: leadsA[13].id, value: 24000, paidAmount: 24000, deliveryStatus: DeliveryStatus.DELIVERED, deliveryDate: new Date('2025-05-30') } }),
    prisma.order.create({ data: { leadId: leadsA[14].id, value: 18000, paidAmount: 9000, deliveryStatus: DeliveryStatus.IN_PROGRESS, deliveryDate: new Date('2025-08-30') } }),
    prisma.order.create({ data: { leadId: leadsA[9].id, value: 430000, paidAmount: 215000, deliveryStatus: DeliveryStatus.PENDING, deliveryDate: new Date('2025-11-15') } }),
    prisma.order.create({ data: { leadId: leadsA[6].id, value: 310000, paidAmount: 155000, deliveryStatus: DeliveryStatus.IN_PROGRESS, deliveryDate: new Date('2025-09-30') } }),
    prisma.order.create({ data: { leadId: leadsA[10].id, value: 280000, paidAmount: 280000, deliveryStatus: DeliveryStatus.DELIVERED, deliveryDate: new Date('2025-07-20') } }),
  ]);

  // ─── User B: Steady State ────────────────────────────────────────────────

  const userB = await prisma.user.create({
    data: {
      name: 'Vithya',
      email: 'diana@steadystate.co',
    },
  });

  const stratB1 = await prisma.strategy.create({
    data: {
      userId: userB.id,
      name: 'Retention & Expansion 2025',
      budget: 280000,
      targetRevenue: 950000,
      progress: 54,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      metadata: { priority: 'high', focus: 'retention', churnReduction: '12%' },
    },
  });

  const stratB2 = await prisma.strategy.create({
    data: {
      userId: userB.id,
      name: 'Mid-Market Acquisition',
      budget: 185000,
      targetRevenue: 680000,
      progress: 38,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-12-31'),
      metadata: { priority: 'medium', targetSize: '50-500 employees' },
    },
  });

  // Channels for B1
  const chanB1_1 = await prisma.channel.create({
    data: {
      strategyId: stratB1.id,
      name: 'Customer Success Outreach',
      cost: 85000,
      metadata: { csms: 6, accountsCovered: 142, nps: 64 },
    },
  });

  const chanB1_2 = await prisma.channel.create({
    data: {
      strategyId: stratB1.id,
      name: 'Email Nurture Campaigns',
      cost: 42000,
      metadata: { sequences: 8, avgOpenRate: 28.6, revenuePerEmail: 840 },
    },
  });

  // Channels for B2
  const chanB2_1 = await prisma.channel.create({
    data: {
      strategyId: stratB2.id,
      name: 'Inbound & Content',
      cost: 68000,
      metadata: { mqlPerMonth: 45, conversionRate: 18.2 },
    },
  });

  const chanB2_2 = await prisma.channel.create({
    data: {
      strategyId: stratB2.id,
      name: 'SDR Outbound',
      cost: 72000,
      metadata: { sdrs: 4, callsPerDay: 60, meetingRate: 8.4 },
    },
  });

  // Activities for B channels
  const actB1_1_1 = await prisma.activity.create({
    data: {
      channelId: chanB1_1.id,
      name: 'Quarterly Business Reviews',
      assignee: 'Tom Bradley',
      cost: 45000,
      status: ActivityStatus.ACTIVE,
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-12-15'),
    },
  });

  const actB1_1_2 = await prisma.activity.create({
    data: {
      channelId: chanB1_1.id,
      name: 'Upsell Health Score Program',
      assignee: 'Rachel Kim',
      cost: 28000,
      status: ActivityStatus.ACTIVE,
      startDate: new Date('2025-04-01'),
      endDate: new Date('2025-09-30'),
    },
  });

  const actB1_2_1 = await prisma.activity.create({
    data: {
      channelId: chanB1_2.id,
      name: 'Re-engagement Campaign',
      assignee: 'Mike Santos',
      cost: 22000,
      status: ActivityStatus.COMPLETED,
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-04-30'),
    },
  });

  const actB2_1_1 = await prisma.activity.create({
    data: {
      channelId: chanB2_1.id,
      name: 'Thought Leadership Blog Series',
      assignee: 'Sarah Lee',
      cost: 32000,
      status: ActivityStatus.ACTIVE,
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-12-31'),
    },
  });

  const actB2_2_1 = await prisma.activity.create({
    data: {
      channelId: chanB2_2.id,
      name: 'Cold Outbound - Fintech Vertical',
      assignee: 'Jake Martinez',
      cost: 42000,
      status: ActivityStatus.ACTIVE,
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-09-15'),
    },
  });

  const actB2_2_2 = await prisma.activity.create({
    data: {
      channelId: chanB2_2.id,
      name: 'Referral Program Outreach',
      assignee: 'Amy Chen',
      cost: 18000,
      status: ActivityStatus.PENDING,
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-11-30'),
    },
  });

  // Leads for User B
  const leadsB = await Promise.all([
    prisma.lead.create({ data: { activityId: actB1_1_1.id, company: 'Brightline Software', contactName: 'Paul Newton', value: 84000, stage: LeadStage.CLOSURE, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actB1_1_1.id, company: 'Horizon Analytics', contactName: 'Claire Dubois', value: 62000, stage: LeadStage.EVALUATION, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actB1_1_2.id, company: 'ClearPath Solutions', contactName: 'Nathan Reed', value: 48000, stage: LeadStage.SALES, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actB1_1_2.id, company: 'BlueRidge Capital', contactName: 'Monica Shaw', value: 92000, stage: LeadStage.EVALUATION, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actB1_2_1.id, company: 'Summit Operations', contactName: 'Derek Walsh', value: 35000, stage: LeadStage.CHEMISTRY, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actB2_1_1.id, company: 'TechEdge Group', contactName: 'Lily Jordan', value: 56000, stage: LeadStage.SALES, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actB2_1_1.id, company: 'Nexus Consulting', contactName: 'Brian Foster', value: 38000, stage: LeadStage.DRAFT, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actB2_2_1.id, company: 'AlphaFin Technologies', contactName: 'Isabella Ross', value: 74000, stage: LeadStage.CLOSURE, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actB2_2_1.id, company: 'Verdant Systems', contactName: 'Oscar Webb', value: 44000, stage: LeadStage.CHEMISTRY, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actB2_2_2.id, company: 'CoreLogic Inc', contactName: 'Hannah Blake', value: 28000, stage: LeadStage.DRAFT, status: 'open' } }),
  ]);

  // Orders for User B
  await Promise.all([
    prisma.order.create({ data: { leadId: leadsB[0].id, value: 84000, paidAmount: 84000, deliveryStatus: DeliveryStatus.DELIVERED, deliveryDate: new Date('2025-07-10') } }),
    prisma.order.create({ data: { leadId: leadsB[7].id, value: 74000, paidAmount: 37000, deliveryStatus: DeliveryStatus.IN_PROGRESS, deliveryDate: new Date('2025-09-01') } }),
    prisma.order.create({ data: { leadId: leadsB[2].id, value: 48000, paidAmount: 24000, deliveryStatus: DeliveryStatus.PENDING, deliveryDate: new Date('2025-10-15') } }),
    prisma.order.create({ data: { leadId: leadsB[5].id, value: 56000, paidAmount: 56000, deliveryStatus: DeliveryStatus.DELIVERED, deliveryDate: new Date('2025-06-30') } }),
  ]);

  // ─── User C: Early Stage ─────────────────────────────────────────────────

  const userC = await prisma.user.create({
    data: {
      name: 'Bredrick',
      email: 'alex@earlystage.dev',
    },
  });

  const stratC1 = await prisma.strategy.create({
    data: {
      userId: userC.id,
      name: 'Product-Market Fit Sprint',
      budget: 45000,
      targetRevenue: 120000,
      progress: 22,
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-10-31'),
      metadata: { stage: 'seed', focus: 'validation', targetCustomers: 10 },
    },
  });

  // Channels for C1
  const chanC1_1 = await prisma.channel.create({
    data: {
      strategyId: stratC1.id,
      name: 'Founder-led Sales',
      cost: 12000,
      metadata: { directOutreach: true, networkDeals: 4 },
    },
  });

  const chanC1_2 = await prisma.channel.create({
    data: {
      strategyId: stratC1.id,
      name: 'Community & Hacker News',
      cost: 3500,
      metadata: { posts: 8, signups: 124, paidConversions: 3 },
    },
  });

  // Activities for C channels
  const actC1_1_1 = await prisma.activity.create({
    data: {
      channelId: chanC1_1.id,
      name: 'Warm Intro Campaigns',
      assignee: 'Bredrick',
      cost: 8000,
      status: ActivityStatus.ACTIVE,
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-10-31'),
    },
  });

  const actC1_2_1 = await prisma.activity.create({
    data: {
      channelId: chanC1_2.id,
      name: 'Show HN Launch',
      assignee: 'Bredrick',
      cost: 2000,
      status: ActivityStatus.COMPLETED,
      startDate: new Date('2025-05-15'),
      endDate: new Date('2025-05-20'),
    },
  });

  const actC1_2_2 = await prisma.activity.create({
    data: {
      channelId: chanC1_2.id,
      name: 'Developer Community Outreach',
      assignee: 'Jamie Wu',
      cost: 4500,
      status: ActivityStatus.PENDING,
      startDate: new Date('2025-08-01'),
      endDate: new Date('2025-10-31'),
    },
  });

  // Leads for User C
  const leadsC = await Promise.all([
    prisma.lead.create({ data: { activityId: actC1_1_1.id, company: 'SparkBuild Studio', contactName: 'Lena Kovacs', value: 8400, stage: LeadStage.SALES, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actC1_1_1.id, company: 'NanoSoft Labs', contactName: 'Ben Adler', value: 6200, stage: LeadStage.CHEMISTRY, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actC1_2_1.id, company: 'Pixel Hopper', contactName: 'Cathy Moon', value: 3600, stage: LeadStage.CLOSURE, status: 'open' } }),
    prisma.lead.create({ data: { activityId: actC1_2_2.id, company: 'DevShip.io', contactName: 'Sam Ruiz', value: 4800, stage: LeadStage.DRAFT, status: 'open' } }),
  ]);

  // Orders for User C
  await Promise.all([
    prisma.order.create({ data: { leadId: leadsC[2].id, value: 3600, paidAmount: 3600, deliveryStatus: DeliveryStatus.DELIVERED, deliveryDate: new Date('2025-06-10') } }),
    prisma.order.create({ data: { leadId: leadsC[0].id, value: 8400, paidAmount: 4200, deliveryStatus: DeliveryStatus.PENDING, deliveryDate: new Date('2025-09-30') } }),
  ]);

  console.log('✅ Seed complete!');
  console.log(`   User A (Aggressive Growth): ${userA.id}`);
  console.log(`   User B (Steady State):       ${userB.id}`);
  console.log(`   User C (Early Stage):        ${userC.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
