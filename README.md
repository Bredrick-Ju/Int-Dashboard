# Worklyft Dashboard

A real-time revenue operations dashboard built with Next.js, NestJS, PostgreSQL, and WebSocket for live data updates.

---

## Tech Stack

| Layer     | Technology           |
|-----------|----------------------|
| Frontend  | Next.js (React)      |
| Backend   | NestJS               |
| Database  | PostgreSQL           |
| Real-time | WebSocket (Socket.io)|

---

## Prerequisites

Before getting started, make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or above)
- [PostgreSQL](https://www.postgresql.org/) — open **pgAdmin** and ensure the service is running with your password set

---

## Setup Guide

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd worklyft-dashboard
```

---

### 2. Configure Environment Variables

This project requires `.env` files for both the **backend** and **frontend**.

#### Backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and update the `DATABASE_URL` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://<username>:<password>@<hostname>:<port>/worklyft_db?schema=public"
PORT=4000
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

> Example: `postgresql://postgres:yourpassword@localhost:5432/worklyft_db?schema=public`

#### Frontend

```bash
cd ../frontend
cp .env.example .env
```

The frontend `.env` values should be:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

---

### 3. Database Setup & Seeding

From the **root** of the project (`worklyft-dashboard/`), run the following commands in order:

```bash
# 1. Generate the Prisma client
npm run prisma:generate --workspace=backend

# 2. Run database migrations
npm run db:migrate

# 3. Seed the database with initial data
npm run db:seed
```

> These commands will create all required tables and populate the database with sample data.

---

### 4. Install Dependencies

From the **root** of the project (`worklyft-dashboard/`), run:

```bash
npm install --force
```

This installs packages for all workspaces — backend, frontend, and shared — in a single step.

---

### 5. Start the Application

From the **root** of the project, run:

```bash
npm run dev
```

This starts both the frontend and backend concurrently.

| Service         | URL                              |
|-----------------|----------------------------------|
| Frontend (UI)   | http://localhost:3000            |
| Backend API     | http://localhost:4000            |
| Swagger Docs    | http://localhost:4000/api/docs   |

> Once the backend starts, you will see a log confirming **WebSocket server is ready** — this confirms real-time updates are active.

---

## Project Structure

```
worklyft-dashboard/
├── backend/        # NestJS API + Prisma + WebSocket
├── frontend/       # Next.js UI
├── shared/         # Shared types/utilities
└── package.json    # Root monorepo config
```

---

## Testing Info

> **Tip:** Keep two browser windows open side-by-side: one on the `/dashboard` overview, and one on the `/admin` panel. When you submit inputs on the admin panel, they instantly sync on the dashboard!

---

## Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Analytics
![Analytics](./screenshots/analytics.png)

### Revenue
![Revenue](./screenshots/revenue.png)

### Admin
![Admin](./screenshots/admin.png)

---

## Developed by Bredrick