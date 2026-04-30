# Tickets

A full-stack ticket management system built with a Node.js/Express backend, Next.js frontend, PostgreSQL database, and AWS CDK infrastructure.

---


### CDK (`apps/cdk`)

Infrastructure as code using AWS CDK (TypeScript).

---

## Requirements

| Tool | Version |
|------|---------|
| Node.js | ≥ 20 |
| pnpm | 10.24.0 |
| Docker & Docker Compose | any recent version |
| AWS CLI (for deployment) | v2 |
| AWS CDK CLI (for deployment) | v2 |

---

## Environment Variables

Create a `.env` file in the repository root before running. Required variables:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=ticket

# JWT
JWT_SECRET=your_jwt_secret
```

---


### Option 1 — Docker Compose (recommended)

Starts PostgreSQL, backend, and frontend in containers:

```bash
cp .env.example .env   # fill in your values
docker compose up --build
```

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000      |
| Backend  | http://localhost:4001      |
| Postgres | localhost:5432             |

### Option 2 — Local dev servers

Requires a running PostgreSQL instance configured in `.env`.

```bash
# Install dependencies
pnpm install

# Run migrations
pnpm --filter=backend migrations:run

# Start both servers concurrently
pnpm start
```

This runs:
- `pnpm --filter=backend dev` — nodemon with ts-node on port 4001
- `pnpm --filter=frontend dev` — Next.js dev server on port 3000

### Database Migrations

```bash
# Run pending migrations
pnpm --filter=backend migrations:run

# Revert last migration
pnpm --filter=backend migrations:revert

# Show migration status
pnpm --filter=backend migrations:show
```

---

## AWS Infrastructure

The `apps/cdk` package defines the full AWS infrastructure using CDK. Two environments are deployed: **`prod`** and **`qa`**.


### Infrastructure Diagram

```
Internet
    │
    ▼
┌───────────────────────────────┐
│  Application Load Balancer    │  (internet-facing, public subnets)
│  ticket-alb-{env}             │
└──────────────┬────────────────┘
               │ HTTP :80 → :3000
               ▼
┌───────────────────────────────┐
│  ECS Fargate Service          │  (private subnets)
│  ticket-cluster-{env}         │
│                               │
│  ┌────────────┐ ┌───────────┐ │
│  │  frontend  │ │  backend  │ │  ← sidecar in same task
│  │   :3000    │ │   :4001   │ │
│  └────────────┘ └─────┬─────┘ │
└────────────────────────┼───────┘
                         │
                         ▼
              ┌──────────────────┐
              │  RDS PostgreSQL  │  (private subnet)
              │  ticket-db-{env} │
              └──────────────────┘
                         │
              ┌──────────────────┐
              │ Secrets Manager  │
              │  DB credentials  │
              └──────────────────┘
```
