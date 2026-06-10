# Worklyft Real-Time Revenue Operations Dashboard

An enterprise-grade, full-stack real-time revenue operations (RevOps) dashboard demonstrating a deep organizational data hierarchy: **Strategy → Channel → Activity → Lead → Order**. 

Built with **Next.js 15 (App Router)**, **NestJS**, **Prisma ORM**, **PostgreSQL**, **Socket.io**, and **Zustand**, this application supports real-time multi-user data isolation, instant room synchronization, drag-and-drop pipelines, and interactive financial analytics.

---

## 🌟 Key Features & Core Concept

Worklyft represents a hierarchical revenue operations dashboard designed for organizations to track their strategic investments down to direct order realizations. The dashboard adapts dynamically based on three distinct executive personas, offering complete multi-user data isolation:

### 1. Multi-User Executive Personas
Toggle seamlessly between 3 distinct executive profiles directly from the sidebar without page reloads. Each persona has its own database-isolated hierarchy, goals, and metrics:
- **Ashwin (Aggressive Growth Profile):** High marketing budget (₹1.8M+), high strategy volumes, and target revenues (₹8.6M+). Focuses on massive market penetration and enterprise customer acquisition.
- **Vithya (Steady State Profile):** Balanced pipeline, moderate budgets, focusing on retention, account expansion, and mid-market growth.
- **Bredrick (Early Stage Profile):** Minimal budget (₹45k), founder-led sales, focused on validation, hacker community outreach, and product-market fit.

### 2. Live WebSocket Synchronization
The platform utilizes a **Socket.io room broadcast architecture**. When strategy status, activities, or leads are modified in the Admin Console or dragged on the Kanban board:
- The server commits changes to PostgreSQL.
- The NestJS Event Gateway broadcasts events specifically to the active user's socket room.
- The frontend receives events, triggers rich toast notifications via **Sonner**, and invalidates the TanStack Query cache.
- The dashboard refetches and animates the updated metrics smoothly without refreshing the page.

### 3. Premium Analytics & Interactive Dashboards
- **Overview Dashboard:** Contains live-updating KPI cards, financial charts, and the primary pipeline kanban board.
- **Performance Analytics Page:** Provides a detailed ROI audit, budget allocation trackers, pipeline conversion rates, and a tabular audit breakdown of strategic targets vs. actual revenue.
- **Revenue Operations Ledger:** Lists all finalized contract orders, paid-in balances, outstanding invoices, and displays a graphical fulfillment funnel (Delivered, In Progress, Pending).
- **Interactive UI Components:** Built using custom Glassmorphism components, **Recharts** visualizations (Bar, Line, Donut charts), **Framer Motion** layout animations, and an `AnimatedNumber` component for count-up numeric animations.

### 4. Drag-and-Drop Kanban Board
Move client leads through custom pipeline stages (`Draft` → `Chemistry` → `Sales` → `Evaluation` → `Closure`) using `@dnd-kit`. Supports **optimistic UI updates** that instantly change the layout and gracefully roll back in case of network errors.

### 5. Admin Simulation Console
A testing control center enabling administrators to:
- Push leads to different stages.
- Toggle the active status of marketing & sales activities.
- Create and commit new commercial contract orders for leads (instantly reflecting in realized/outstanding revenue widgets).

---

## 🛠️ Technology Stack

### Monorepo Workspaces
- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS (Vanilla CSS variables config), Framer Motion, TanStack Query v5, Zustand, Recharts, Socket.io-client, Sonner.
- **Backend:** NestJS, TypeScript, Prisma ORM, Socket.io Gateway, PostgreSQL.
- **Shared:** Common models, type declarations, socket event names (`SocketEvents`), and API DTOs shared between client and server.

---

## 📁 Directory Structure

```text
worklyft-dashboard/
├── backend/                  # NestJS Application
│   ├── prisma/               # Database schema definitions & seeding scripts
│   └── src/
│       ├── common/           # NestJS filters, guards, and custom pipes
│       ├── gateways/         # Socket.io WebSocket Event Gateways
│       ├── modules/          # Core modules: users, strategies, dashboard, leads, orders, activities
│       └── main.ts           # Server entry point, Swagger Setup, & middleware
├── frontend/                 # Next.js 15 App Router Application
│   ├── src/
│   │   ├── app/              # Router pages (dashboard, analytics, revenue, admin)
│   │   ├── components/       # Layouts (Sidebar, Topbar), widgets, charts, and Kanban board
│   │   ├── hooks/            # TanStack Query custom hooks (useDashboard)
│   │   ├── lib/              # Axios client API wrapper & WebSocket socket-manager
│   │   ├── providers/        # React Context wrappers (QueryProvider, SocketProvider)
│   │   ├── store/            # Zustand app state store (useAppStore)
│   │   └── types/            # App-specific UI interfaces
├── shared/                   # Shared TypeScript definitions, socket payloads, & DTOs
└── package.json              # Monorepo configuration specifying workspaces
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20 or higher recommended)
- **npm** (v10 or higher)
- **PostgreSQL** database running locally or in the cloud

### Setup Instructions

#### 1. Configure Environment Variables
Create a `.env` file inside the `backend/` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/worklyft_db?schema=public"
PORT=4000
FRONTEND_URL=http://localhost:3000
```

#### 2. Install Monorepo Dependencies
From the root of the project, run:
```bash
npm install
```

#### 3. Run Database Migrations & Seeds
Generate Prisma Clients, apply migrations to database, and load default personas (Ashwin, Vithya, Bredrick) with mock business structures:
```bash
# Run migrations
npm run db:migrate

# Seed data
npm run db:seed
```

#### 4. Spin Up the Development Servers
Launch both the frontend and backend servers concurrently:
```bash
npm run dev
```
- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend Server:** [http://localhost:4000](http://localhost:4000)
- **Swagger Documentation:** [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## 📡 API & WebSocket Specification

The backend exposes a prefix-mapped REST API under `/api/v1` along with real-time Socket.io endpoints.

### Swagger Documentation
A live, interactive Swagger OpenAPI specification dashboard is available at [http://localhost:4000/api/docs](http://localhost:4000/api/docs).

### REST Endpoints
- **Users**
  - `GET /users` - Retrieve all bootstrap executive personas.
- **Dashboard**
  - `GET /dashboard/:userId` - Aggregated, single-query optimized metrics (KPIs, charts, tables).
- **Strategies**
  - `GET /strategies/:userId` - Get all strategies associated with a specific user.
- **Leads**
  - `GET /leads/:userId` - Get all leads associated with a user's activities.
  - `PATCH /leads/:id/stage` - Update a lead's pipeline stage (triggers WebSocket room broadcast).
- **Orders**
  - `GET /orders/:userId` - Retrieve all committed sales orders.
  - `POST /orders` - Create a new sales contract order (triggers WebSocket room broadcast).
- **Activities**
  - `GET /activities/:userId` - Retrieve all marketing & sales activities.
  - `PATCH /activities/:id/status` - Toggle activity status (triggers WebSocket room broadcast).

### WebSocket Event Hooks (Socket.io)
Clients subscribe/emit using the following events (`SocketEvents`):
- `join_room` / `leave_room` - Subscribe/unsubscribe client sockets to user-isolated rooms named after `userId`.
- `lead.updated` - Broadcasted when a lead moves across columns.
- `order.created` - Broadcasted when a commercial contract is committed.
- `activity.updated` - Broadcasted when an activity status changes.

---

## ⚡ Performance Optimizations

### Single-Query Aggregation Pipeline
To eliminate the performance overhead of N+1 database queries, the backend uses Prisma to fetch the nested hierarchy (`Strategy → Channel → Activity → Lead → Order`) in a single SQL operation. The server then constructs KPI summaries, charts, and tables in-memory, delivering dashboard responses in sub-10ms times.

---

## 🧪 Testing Real-Time Operations

To experience the WebSocket synchronization live:
1. Open two browser windows side-by-side:
   - **Window 1 (Client View):** [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (Overview dashboard for user)
   - **Window 2 (Admin Console):** [http://localhost:3000/admin](http://localhost:3000/admin) (Admin panel)
2. In the Admin Console, select a lead belonging to the active user (e.g., Ashwin/Vithya/Bredrick).
3. Create a new contract order or change the lead's stage.
4. Observe Window 1 update instantly: counter stats increment with animations and toast notifications confirm the event.

---

*Developed by Bredrick*
