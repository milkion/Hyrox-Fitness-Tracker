# Hyrox Fitness Tracker — Backend API

A RESTful backend for tracking Hyrox training. Athletes can follow predefined plans, fork and customise them, log completed sessions, and review progress over time.

## What is Hyrox?

Hyrox is a standardised fitness race: 8 rounds of a 1km run followed by a functional station (SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Lunges, Wall Balls). Training requires a mix of running fitness, compromised-running ability, and station-specific strength/conditioning.

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express |
| Database | PostgreSQL |
| ORM | Prisma |
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

## Planned Features

- **Auth** — JWT-based sign-up, login, and protected routes; passwords hashed with bcrypt/argon2
- **Predefined plans** — system-seeded plans (Singles, Doubles, Compromised Running, Strength Foundations, Beginner Conditioning)
- **Custom plans** — create from scratch, fork a system plan, or mix workouts from multiple plans
- **Session scheduling** — attach a plan to a date/time, track status through to completion
- **Workout logging** — record actual times, weights, reps, and perceived effort per exercise
- **Progress reports** — personal bests per station, volume trends, compromised-running pace, completion rate, estimated race time

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
# Set DATABASE_URL in .env

# Run migrations
npm run migrate

# Generate Prisma client
npm run prisma
```

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |

## Scripts

| Command | Description |
|---|---|
| `npm run migrate` | Run Prisma migrations against the dev database |
| `npm run prisma` | Regenerate the Prisma client |
| `npm run lint` | Lint with Biome |
| `npm run format` | Format all files with Biome |
| `npm run check` | Lint + format in one pass |

## Project Structure

```
src/
  app.ts           Express app setup
  server.ts        HTTP server entry point
  config/          Environment config
  controllers/     Route handlers
  middleware/       Auth and validation middleware
  routes/          Express routers
  services/        Business logic
  types/           Shared TypeScript types
  utils/           Helper functions
  validators/      Request validation schemas

prisma/
  schema/          Split Prisma schema files (one per model)
  migrations/      Prisma migration history

generated/
  prisma/          Auto-generated Prisma client (do not edit)
```

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/). Commit messages are enforced by commitlint on every commit via Husky.

```
feat: add fork plan endpoint
fix: correct distance unit on sled push seed
chore: update biome config
```
