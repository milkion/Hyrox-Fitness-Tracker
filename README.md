# Hyrox Fitness Tracker — Backend API

A RESTful backend for tracking Hyrox training. Athletes can follow predefined plans, fork and customise them, log completed sessions, and review progress over time.

## What is Hyrox?

Hyrox is a standardised fitness race: 8 rounds of a 1km run followed by a functional station (SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Lunges, Wall Balls). Training requires a mix of running fitness, compromised-running ability, and station-specific strength/conditioning.

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 20+ |
| Language | TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Prisma |
| Password hashing | Argon2 |
| Validation | Zod |
| Linter / Formatter | Biome |
| Commit convention | Conventional Commits (commitlint + Husky) |

## Data Model

```
User
 ├── Plan[]           (custom / forked plans owned by the user)
 ├── WorkoutSession[] (scheduled or completed sessions)
 └── WorkoutLog[]     (per-exercise logs within a session)

Plan
 ├── PlanItem[]       (ordered list of exercises with prescribed metrics)
 └── forkedFrom?      (self-referential — tracks which system plan it came from)

PlanItem
 ├── Exercise         (exercise definition: name + type)
 └── metrics          (distance, weight, reps, sets — nullable per exercise type)

WorkoutSession
 └── WorkoutLog[]     (one entry per PlanItem executed)

WorkoutLog
 └── startTime / endTime (actual performance for that exercise)
```

### Exercise types

| Type | Description |
|---|---|
| `RUN` | Running intervals measured by distance |
| `STATION` | Official Hyrox stations (distance or rep-based) |
| `STRENGTH` | Accessory lifts measured by sets/reps/weight |
| `CORE` | Core work measured by duration |

### Plan difficulty levels

`BEGINNER` · `INTERMEDIATE` · `ADVANCED`

### WorkoutSession statuses

`SCHEDULED` · `IN_PROGRESS` · `COMPLETED` · `CANCELLED`

## API Endpoints

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | — | Create a new account |
| `POST` | `/auth/login` | — | Log in and receive a JWT |

### Plans

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/plans` | Required | List system plans and the authenticated user's custom plans |
| `GET` | `/plans/:planId` | Required | Get a single plan with all its items |
| `POST` | `/plans` | Required | Create a custom plan from scratch |
| `POST` | `/plans/:planId/fork` | Required | Fork an existing plan into a personal copy |
| `PATCH` | `/plans/:planId` | Required | Update a plan's metadata or items (owner only) |
| `DELETE` | `/plans/:planId` | Required | Delete a custom plan (system plans are protected) |

## Features

### Implemented

- **Auth** — JWT sign-up and login; passwords hashed with Argon2; `requireAuth` middleware guards all plan routes
- **Input validation** — Zod schemas validate all auth request bodies
- **Predefined plans** — three race-category plans seeded into the database (see [Seed Data](#seed-data))
- **Custom plans** — create from scratch or fork a system plan
- **Plan management** — update and delete your own plans; system plans cannot be modified or deleted

### Remaining

- **Testing** — Jest unit and integration tests for auth flow, permission checks, and core business logic

## Seed Data

Running `npm run seed` populates the database with the eight official Hyrox station exercises and three full race-simulation plans:

| Plan | Difficulty | Category |
|---|---|---|
| Women's Open | Intermediate | Standard women's weights |
| Men's Open / Women's Pro | Intermediate | Standard men's / elite women's weights |
| Men's Pro | Advanced | Pro/elite men's weights |

Each plan contains 16 ordered PlanItems (8 × 1km run alternated with each functional station).

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (local or hosted, e.g. Neon)

### Setup

```bash
# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env

# Run migrations
npm run migrate

# Generate Prisma client
npm run prisma

# Seed the database with exercises and system plans
npm run seed

# Start the development server
npm run dev
```

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Port for the HTTP server (defaults to `8000`) |
| `SECRET_KEY` | Secret used to sign and verify JWTs |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with `tsx` |
| `npm run migrate` | Run Prisma migrations against the dev database |
| `npm run prisma` | Regenerate the Prisma client |
| `npm run seed` | Seed the database with exercises and base plans |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format all files with Biome |
| `npm run check` | Lint + format in one pass |

## Project Structure

```
src/
  app.ts                Express app setup (middleware + routes)
  server.ts             HTTP server entry point
  lib/
    prisma.ts           Prisma client singleton
  controllers/
    authController.ts   HTTP layer for auth endpoints
    planController.ts   HTTP layer for plan CRUD
  middleware/
    requireAuth.ts      JWT verification middleware
  routes/
    auth.ts             Auth route definitions
    plan.ts             Plan route definitions
  services/
    authService.ts      Auth business logic (hashing, token generation)
    planService.ts      Plan business logic
  types/
    express/            Express Request type augmentation (userId)
  validators/
    auth.ts             Zod schemas for signup and login

prisma/
  schema/               Split Prisma schema files (one per model)
  migrations/           Prisma migration history
  seed.ts               Database seeder

generated/
  prisma/               Auto-generated Prisma client (do not edit)
```

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are enforced by commitlint on every commit via Husky.

```
feat: add fork plan endpoint
fix: correct distance unit on sled push seed
chore: update biome config
```