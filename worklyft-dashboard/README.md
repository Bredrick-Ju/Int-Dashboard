# Worklyft Real-Time Revenue Operations Dashboard

An enterprise-grade, full-stack real-time revenue operations (RevOps) dashboard demonstrating a deep organizational data hierarchy: **Strategy → Channel → Activity → Lead → Order**. 

Built with **Next.js 15**, **NestJS**, **Prisma**, **PostgreSQL**, **Socket.io**, and **Zustand**, this application supports real-time multi-user data isolation, instant room synchronization, drag-and-drop pipelines, and interactive financial analytics.

---

## Key Features

- 🔄 **Real-Time Synchronisation:** Instant UI updates and toast notifications powered by Socket.io room broadcasts when strategies, activities, or leads are modified.
- 👥 **Multi-User Data Isolation:** Toggle seamlessly between 3 distinct executive personas (Aggressive Growth, Steady State, Early Stage) without reloading the page.
- 📊 **Premium Analytics Dashboard:** Interactive data visualizations (revenue trends, budget utilization, channel performance, activity distribution) built with Recharts, complete with Framer Motion transitions.
- 🗂️ **Drag-and-Drop Lead Kanban:** Move client leads through pipeline stages (Draft → Chemistry → Sales → Evaluation → Closure) with optimistic UI updates and backend mutations using `@dnd-kit`.
- ⚙️ **Admin Simulation Console:** Dedicated testing sandbox to generate mock contract orders, toggle campaign activities, and advance lead stages to observe real-time room updates.

---

## Technology Stack

### Monorepo Structure
- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, TanStack Query v5, Zustand, Recharts, Socket.io-client, Sonner
- **Backend:** NestJS, TypeScript, Prisma ORM, Socket.io Gateway, PostgreSQL
- **Shared:** Shared DTOs, interfaces, and socket event enumerations

---

## Directory Structure

```text
worklyft-dashboard/
├── backend/                  # NestJS Application
│   ├── prisma/               # Schema definitions and database seed script
│   └── src/                  # Controllers, services, gateways, filters, modules
├── frontend/                 # Next.js 15 App Router Application
│   ├── src/
│   │   ├── app/              # Dashboard pages (overview, analytics, revenue, admin)
│   │   ├── components/       # Layouts, widgets, charts, and Kanban board
│   │   ├── hooks/            # TanStack Query & user state hooks
│   │   ├── lib/              # Axios client and Socket.io manager
│   │   ├── providers/        # React Query & WebSocket event providers
│   │   └── store/            # Zustand app state store
├── shared/                   # Shared TypeScript interfaces & DTO package
└── package.json              # Monorepo workspaces configuration
```

---

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm (v10 or higher)
- PostgreSQL (v14 or higher) running locally

---

### Quick Start

#### 1. Setup the Database
Ensure you have a PostgreSQL database running. Create a `.env` file inside the `backend/` directory and configure your connection string:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/worklyft_db?schema=public"
PORT=4000
FRONTEND_URL=http://localhost:3000
```

#### 2. Install Dependencies
Run from the monorepo root:
```bash
npm install
```

#### 3. Run Migrations & Seed Data
Generate the Prisma Client, run migrations, and bootstrap the database with default persona profiles:
```bash
npm run db:migrate
npm run db:seed
```

#### 4. Run Applications
Start both backend and frontend applications concurrently:
```bash
npm run dev
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)

---

## Testing Real-Time Operations

To verify real-time room sync features:
1. Open two browser windows side-by-side:
   - Window 1: [http://localhost:3000/dashboard](http://localhost:3000/dashboard) (Overview dashboard for user)
   - Window 2: [http://localhost:3000/admin](http://localhost:3000/admin) (Admin controller panel)
2. In the Admin panel, select the active user's lead or activity.
3. Advance the lead's stage or create a new sales contract order.
4. Watch the Overview dashboard in Window 1 instantly trigger an animated number counter transition and display a success toast notification without reloading.

---

## API Documentation

The backend exposes the following REST API endpoints under `/api/v1`:

### Users
- `GET /users` - Retrieve all bootstrap executive personas.

### Dashboard
- `GET /dashboard/:userId` - Single-query optimized aggregation endpoint for overview KPIs, chart data, and tables.

### Leads
- `PATCH /leads/:id/stage` - Update a lead's pipeline stage (triggers WebSocket room broadcast).

### Orders
- `POST /orders` - Create a new sales order contract (triggers WebSocket room broadcast).

### Activities
- `PATCH /activities/:id/status` - Toggle a marketing activity status (triggers WebSocket room broadcast).
