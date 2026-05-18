# ✂️ Sewing — Enterprise Tailoring Management Platform

A production-ready, DSL-first enterprise platform for managing a tailoring/sewing business.

## Architecture

```
sewing/
├── sewing.dsl.json          ← Application DSL (single source of truth)
├── README.md
├── backend/                 ← Node.js + Express + TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts          ← Express app entry point
│       ├── routes/index.ts   ← All route bindings
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   └── error.middleware.ts
│       ├── agents/           ← Separated responsibility agents
│       │   ├── auth.agent.ts
│       │   ├── customer.agent.ts
│       │   ├── order.agent.ts
│       │   ├── measurement.agent.ts
│       │   ├── inventory.agent.ts
│       │   ├── appointment.agent.ts
│       │   └── invoice.agent.ts
│       └── prisma/
│           └── schema.prisma ← Full Prisma DB schema
├── frontend/                ← React + TypeScript + TailwindCSS
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx           ← Router + navigation
│       ├── services/api.ts   ← All API calls (Axios + JWT interceptor)
│       └── pages/
│           ├── CustomersPage.tsx
│           ├── OrdersPage.tsx
│           ├── InventoryPage.tsx
│           ├── AppointmentsPage.tsx
│           └── InvoicesPage.tsx
└── .github/workflows/ci.yml  ← GitHub Actions CI
```

## Agents

| Agent | Responsibility |
|---|---|
| `AuthAgent` | Register/Login, JWT issuing, bcrypt hashing |
| `CustomerAgent` | Full CRUD for customer profiles |
| `OrderAgent` | Order lifecycle: `NEW → IN_PROGRESS → COMPLETED` |
| `MeasurementAgent` | Upsert per-customer body measurements |
| `InventoryAgent` | Fabric & supply stock tracking |
| `AppointmentAgent` | Scheduling with status tracking |
| `InvoiceAgent` | Billing with `DRAFT/SENT/PAID/OVERDUE` states |

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm 9+

### Backend

```bash
cd backend
cp .env.example .env   # set DATABASE_URL and JWT_SECRET
npm install
npx prisma migrate dev --name init
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables (backend/.env)

```
DATABASE_URL="postgresql://user:password@localhost:5432/sewing"
JWT_SECRET="your-secret-key-here"
PORT=3000
NODE_ENV=development
```

## API Endpoints

| Method | Path | Agent | Auth Required |
|--------|------|-------|---------------|
| POST | `/auth/register` | AuthAgent | No |
| POST | `/auth/login` | AuthAgent | No |
| GET/POST | `/customers` | CustomerAgent | Yes |
| GET/PUT/DELETE | `/customers/:id` | CustomerAgent | Yes |
| GET/POST | `/orders` | OrderAgent | Yes |
| GET/PUT/DELETE | `/orders/:id` | OrderAgent | Yes |
| GET/POST | `/measurements` | MeasurementAgent | Yes |
| GET/PUT | `/measurements/:customerId` | MeasurementAgent | Yes |
| GET/POST | `/inventory` | InventoryAgent | Yes |
| GET/PUT/DELETE | `/inventory/:id` | InventoryAgent | Yes |
| GET/POST | `/appointments` | AppointmentAgent | Yes |
| GET/PUT/DELETE | `/appointments/:id` | AppointmentAgent | Yes |
| GET/POST | `/invoices` | InvoiceAgent | Yes |
| GET/PUT/DELETE | `/invoices/:id` | InvoiceAgent | Yes |

## CI/CD

GitHub Actions runs on every push to `main` or `develop`:
1. Backend: `npm ci` → `npm run build` → `npm test`
2. Frontend: `npm ci` → `npm run build`
