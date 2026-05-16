import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// database population
async function main() {
  // delete DB data to avoid duplication when creating
  const deletePlanItem = prisma.planItem.deleteMany({})
  const deletePlan = prisma.plan.deleteMany({})
  const deleteExercise = prisma.exercise.deleteMany({})

  await prisma.$transaction([deletePlanItem, deletePlan, deleteExercise])

  // race format exercise
  const run = await prisma.exercise.create({
    data: {
      exerciseName: 'run',
      exerciseType: 'RUN',
    },
  })

  const skiErg = await prisma.exercise.create({
    data: {
      exerciseName: 'SkiErg',
      exerciseType: 'STATION',
    },
  })

  const sledPush = await prisma.exercise.create({
    data: {
      exerciseName: 'Sled Push',
      exerciseType: 'STATION',
    },
  })

  const sledPull = await prisma.exercise.create({
    data: {
      exerciseName: 'Sled Pull',
      exerciseType: 'STATION',
    },
  })

  const burpeeBroadJumps = await prisma.exercise.create({
    data: {
      exerciseName: 'Burpee Broad Jumps',
      exerciseType: 'STATION',
    },
  })

  const rowing = await prisma.exercise.create({
    data: {
      exerciseName: 'Rowing',
      exerciseType: 'STATION',
    },
  })

  const farmersCarry = await prisma.exercise.create({
    data: {
      exerciseName: 'Farmers Carry',
      exerciseType: 'STATION',
    },
  })

  const sandbagLunges = await prisma.exercise.create({
    data: {
      exerciseName: 'Sandbag Lunges',
      exerciseType: 'STATION',
    },
  })

  const wallBalls = await prisma.exercise.create({
    data: {
      exerciseName: 'Wall Balls',
      exerciseType: 'STATION',
    },
  })

  // whole plan
  // womens open category
  await prisma.plan.create({
    data: {
      planName: "Women's Open",
      description: "Full race simulation for Women's Open Category",
      difficulty: 'INTERMEDIATE',
      planItem: {
        create: [
          {
            order: 1,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 2,
            distance: 1000,
            exerciseId: skiErg.uuid,
          },
          {
            order: 3,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 4,
            distance: 50,
            weight: 102,
            exerciseId: sledPush.uuid,
          },
          {
            order: 5,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 6,
            distance: 50,
            weight: 78,
            exerciseId: sledPull.uuid,
          },
          {
            order: 7,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 8,
            distance: 80,
            exerciseId: burpeeBroadJumps.uuid,
          },
          {
            order: 9,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 10,
            distance: 1000,
            exerciseId: rowing.uuid,
          },
          {
            order: 11,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 12,
            distance: 200,
            weight: 32,
            exerciseId: farmersCarry.uuid,
          },
          {
            order: 13,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 14,
            distance: 100,
            weight: 10,
            exerciseId: sandbagLunges.uuid,
          },
          {
            order: 15,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 16,
            reps: 100,
            weight: 4,
            exerciseId: wallBalls.uuid,
          },
        ],
      },
    },
  })

  // mens open / womens pro category
  await prisma.plan.create({
    data: {
      planName: "Men's Open / Women's Pro",
      description: "Full race simulation for Men's Open / Women's Pro Category",
      difficulty: 'INTERMEDIATE',
      planItem: {
        create: [
          {
            order: 1,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 2,
            distance: 1000,
            exerciseId: skiErg.uuid,
          },
          {
            order: 3,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 4,
            distance: 50,
            weight: 152,
            exerciseId: sledPush.uuid,
          },
          {
            order: 5,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 6,
            distance: 50,
            weight: 103,
            exerciseId: sledPull.uuid,
          },
          {
            order: 7,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 8,
            distance: 80,
            exerciseId: burpeeBroadJumps.uuid,
          },
          {
            order: 9,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 10,
            distance: 1000,
            exerciseId: rowing.uuid,
          },
          {
            order: 11,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 12,
            distance: 200,
            weight: 48,
            exerciseId: farmersCarry.uuid,
          },
          {
            order: 13,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 14,
            distance: 100,
            weight: 20,
            exerciseId: sandbagLunges.uuid,
          },
          {
            order: 15,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 16,
            reps: 100,
            weight: 6,
            exerciseId: wallBalls.uuid,
          },
        ],
      },
    },
  })

  // mens pro category
  await prisma.plan.create({
    data: {
      planName: "Men's Pro",
      description: "Full race simulation for Men's Pro Category",
      difficulty: 'ADVANCED',
      planItem: {
        create: [
          {
            order: 1,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 2,
            distance: 1000,
            exerciseId: skiErg.uuid,
          },
          {
            order: 3,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 4,
            distance: 50,
            weight: 202,
            exerciseId: sledPush.uuid,
          },
          {
            order: 5,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 6,
            distance: 50,
            weight: 153,
            exerciseId: sledPull.uuid,
          },
          {
            order: 7,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 8,
            distance: 80,
            exerciseId: burpeeBroadJumps.uuid,
          },
          {
            order: 9,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 10,
            distance: 1000,
            exerciseId: rowing.uuid,
          },
          {
            order: 11,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 12,
            distance: 200,
            weight: 64,
            exerciseId: farmersCarry.uuid,
          },
          {
            order: 13,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 14,
            distance: 100,
            weight: 30,
            exerciseId: sandbagLunges.uuid,
          },
          {
            order: 15,
            distance: 1000,
            exerciseId: run.uuid,
          },
          {
            order: 16,
            reps: 100,
            weight: 9,
            exerciseId: wallBalls.uuid,
          },
        ],
      },
    },
  })
}

main()
  .then(async () => {
    //disconnect prisma and shut down connection pool
    await prisma.$disconnect()
    await pool.end()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    await pool.end()
    process.exit(1)
  })
