# Worklyft Database Documentation (Prisma & PostgreSQL)

This document provides a comprehensive overview of the database schema, table structures, relationship models, connection setup, and migration/seed workflows for the **Worklyft Real-Time Revenue Operations Dashboard**.

---

## 📊 Database Architecture (ERD)

The database schema is organized as a hierarchical cascading structure representing the revenue operations flow from users to individual customer orders.

```mermaid
erDiagram
    users ||--o{ strategies : "owns"
    strategies ||--o{ channels : "contains"
    channels ||--o{ activities : "drives"
    activities ||--o{ leads : "generates"
    leads ||--o{ orders : "converts to"

    users {
        string id PK
        string name
        string email UK
        datetime createdAt
        datetime updatedAt
    }

    strategies {
        string id PK
        string userId FK
        string name
        float budget
        float targetRevenue
        float progress
        datetime startDate
        datetime endDate
        json metadata
        datetime createdAt
        datetime updatedAt
    }

    channels {
        string id PK
        string strategyId FK
        string name
        float cost
        json metadata
        datetime createdAt
        datetime updatedAt
    }

    activities {
        string id PK
        string channelId FK
        string name
        string assignee
        float cost
        ActivityStatus status
        datetime startDate
        datetime endDate
        datetime createdAt
        datetime updatedAt
    }

    leads {
        string id PK
        string activityId FK
        string company
        string contactName
        float value
        LeadStage stage
        string status
        datetime createdAt
        datetime updatedAt
    }

    orders {
        string id PK
        string leadId FK
        float value
        float paidAmount
        DeliveryStatus deliveryStatus
        datetime deliveryDate
        datetime createdAt
        datetime updatedAt
    }
```

---

## 🔌 Database Connection Configuration

Worklyft connects to a PostgreSQL database using Prisma ORM.

### 1. Connection URL Format
The database connection string is defined in the `DATABASE_URL` environment variable within the `backend/.env` file. It follows the standard PostgreSQL URL pattern:

```ini
DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database_name>?schema=public"
```

- **Default local dev string**: `postgresql://postgres:postgres@localhost:5432/worklyft_db?schema=public`

### 2. Environment Setup
Create a `.env` file in the `backend/` directory by copying `.env.example`:

```bash
# From workspace root
copy backend\.env.example backend\.env
```

Ensure the values match your local or cloud PostgreSQL instance before running migrations or seeding.

---

## 🛠️ CLI Operations (Migrate & Seed)

We provide wrapper scripts in the root `package.json` to easily manage database migrations, client generation, and data seeding across the monorepo workspace.

### 1. Root Monorepo Commands
Run these commands from the **root** folder:

| Task | Command | Description |
| :--- | :--- | :--- |
| **Run Migrations** | `npm run db:migrate` | Runs Prisma development migrations to apply schema changes to PostgreSQL. |
| **Seed Database** | `npm run db:seed` | Clears all tables and seeds fresh mock data (personas, strategies, leads, orders). |
| **Open Prisma Studio** | `npm run db:studio` | Opens a local web UI (`http://localhost:5555`) to view and edit database records. |

### 2. Manual Backend Commands
If you prefer running commands directly within the `backend` workspace, navigate to `/backend` (or run them with workspace flags):

```bash
# Generate Prisma Client
npx prisma generate --schema=prisma/schema.prisma

# Create and apply a new migration
npx prisma migrate dev --name <migration_name> --schema=prisma/schema.prisma

# Push schema directly to database (without creating a migration file)
npx prisma db push --schema=prisma/schema.prisma

# Seed the database manually
npx prisma db seed
```

---

## 🗃️ Tables & Schema Details

Here is the breakdown of all the tables defined in [schema.prisma](file:///f:/Dashboard/Int-Dashboard/worklyft-dashboard/backend/prisma/schema.prisma).

### 1. `users` Table
Stores Worklyft dashboard user accounts representing distinct personas (e.g., Aggressive Growth, Steady State, Early Stage).

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id`, `default(cuid())` | Unique identifier (Collision-resistant Unique ID). |
| `name` | `String` | | Full name of the user. |
| `email` | `String` | `@unique` | Unique email address. |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp. |
| `updatedAt` | `DateTime` | `@updatedAt` | Last modification timestamp. |

- **Relations**: `strategies` (One-to-Many cascade link to Strategy model).

---

### 2. `strategies` Table
Represents high-level business goals or marketing/sales initiatives belonging to a User.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id`, `default(cuid())` | Unique identifier. |
| `userId` | `String` | Foreign Key | Owner ID (references `User.id` with `onDelete: Cascade`). |
| `name` | `String` | | Title of the campaign/strategy. |
| `budget` | `Float` | | Financial budget allocated. |
| `targetRevenue` | `Float` | | Revenue goal. |
| `progress` | `Float` | `@default(0)` | Current progress percentage (0 - 100). |
| `startDate` | `DateTime` | | Scheduled start date. |
| `endDate` | `DateTime` | | Scheduled end date. |
| `metadata` | `Json` | `@default("{}")` | Custom metadata (e.g. priority, target tier, region). |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp. |
| `updatedAt` | `DateTime` | `@updatedAt` | Last modification timestamp. |

---

### 3. `channels` Table
Specifies marketing/acquisition channels (e.g. Paid Search, LinkedIn ABM, Partner Program) under a specific Strategy.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id`, `default(cuid())` | Unique identifier. |
| `strategyId` | `String` | Foreign Key | References `Strategy.id` with `onDelete: Cascade`. |
| `name` | `String` | | Channel name. |
| `cost` | `Float` | | Financial cost allocated to this channel. |
| `metadata` | `Json` | `@default("{}")` | Key-value metrics (e.g., open rates, CTR, impressions). |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp. |
| `updatedAt` | `DateTime` | `@updatedAt` | Last modification timestamp. |

---

### 4. `activities` Table
Represents execution plans or assignments associated with a channel.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id`, `default(cuid())` | Unique identifier. |
| `channelId` | `String` | Foreign Key | References `Channel.id` with `onDelete: Cascade`. |
| `name` | `String` | | Name of the activity task. |
| `assignee` | `String` | | Team member responsible. |
| `cost` | `Float` | | Individual activity cost. |
| `status` | `ActivityStatus` | `@default(PENDING)` | Current execution status (Enum). |
| `startDate` | `DateTime` | | Activity start. |
| `endDate` | `DateTime` | | Activity end. |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp. |
| `updatedAt` | `DateTime` | `@updatedAt` | Last modification timestamp. |

---

### 5. `leads` Table
Represents potential customer deals generated from an activity.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id`, `default(cuid())` | Unique identifier. |
| `activityId` | `String` | Foreign Key | References `Activity.id` with `onDelete: Cascade`. |
| `company` | `String` | | Target company name. |
| `contactName` | `String` | | Primary contact person. |
| `value` | `Float` | | Potential deal size value. |
| `stage` | `LeadStage` | `@default(DRAFT)` | Current pipeline stage (Enum). |
| `status` | `String` | `@default("open")` | Status of lead (e.g., "open", "won", "lost"). |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp. |
| `updatedAt` | `DateTime` | `@updatedAt` | Last modification timestamp. |

---

### 6. `orders` Table
Tracks converted leads and finalized transactions.

| Column | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `id` | `String` | `@id`, `default(cuid())` | Unique identifier. |
| `leadId` | `String` | Foreign Key | References `Lead.id` with `onDelete: Cascade`. |
| `value` | `Float` | | Final contract/order value. |
| `paidAmount` | `Float` | | Amount paid by client so far. |
| `deliveryStatus` | `DeliveryStatus` | `@default(PENDING)` | Fulfillment status (Enum). |
| `deliveryDate` | `DateTime` | | Fulfillment/delivery target date. |
| `createdAt` | `DateTime` | `@default(now())` | Creation timestamp. |
| `updatedAt` | `DateTime` | `@updatedAt` | Last modification timestamp. |

---

## 🏷️ Custom Enums

### 1. `ActivityStatus`
Used on the `activities` table to track work items.
- `ACTIVE`
- `PENDING`
- `COMPLETED`

### 2. `LeadStage`
Used on the `leads` table to represent sales progression.
- `DRAFT` (Initial ingestion)
- `CHEMISTRY` (Introductory call)
- `SALES` (Proposal and pricing)
- `EVALUATION` (Demo / negotiation)
- `CLOSURE` (Final contract stage)

### 3. `DeliveryStatus`
Used on the `orders` table to monitor fulfillment.
- `PENDING`
- `IN_PROGRESS`
- `DELIVERED`

---

## 🌱 Seed Persona Specifications

The database seeding process creates three distinct user personas, each illustrating a different stage of pipeline maturity:

1. **Ashwin (Aggressive Growth)**:
   - High budget strategies with target revenues in millions.
   - Large channels (e.g. Enterprise Ads, ABM, field events).
   - Generates high-value leads with prominent Indian companies (Zoho, TCS, Infosys, Wipro, etc.).
   - Holds several completed and pending orders.

2. **Vithya (Steady State)**:
   - Balanced, mid-market campaigns with moderate budgets.
   - Core focus on customer success outreach, retention, and inbound conversion.
   - Deals linked to established mid-to-large regional brands (Saravana Bhavan, TVS Group, TANSI, etc.).

3. **Bredrick (Early Stage)**:
   - Bootstrapped, small-budget, founder-led campaigns.
   - Focused on Hacker News launches and direct network outreach.
   - Small number of high-conversion target leads (Cognizant, Tata Elxsi, Sonata Software, etc.).
