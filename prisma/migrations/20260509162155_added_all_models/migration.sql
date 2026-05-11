/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('RUN', 'STATION', 'STRENGTH', 'CORE');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "WorkoutSessionStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "fitnessLevel" INTEGER,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("uuid");

-- CreateTable
CREATE TABLE "Exercise" (
    "uuid" TEXT NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "exerciseType" "ExerciseType" NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Plan" (
    "uuid" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "forkedFromId" TEXT,
    "userId" TEXT,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PlanItem" (
    "uuid" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "distance" INTEGER,
    "weight" INTEGER,
    "reps" INTEGER,
    "sets" INTEGER,
    "exerciseId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "PlanItem_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "WorkoutLog" (
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "planItemId" TEXT NOT NULL,
    "workoutSessionId" TEXT NOT NULL,

    CONSTRAINT "WorkoutLog_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "WorkoutSession" (
    "uuid" TEXT NOT NULL,
    "notes" TEXT,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "status" "WorkoutSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "WorkoutSession_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_forkedFromId_fkey" FOREIGN KEY ("forkedFromId") REFERENCES "Plan"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanItem" ADD CONSTRAINT "PlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_planItemId_fkey" FOREIGN KEY ("planItemId") REFERENCES "PlanItem"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_workoutSessionId_fkey" FOREIGN KEY ("workoutSessionId") REFERENCES "WorkoutSession"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSession" ADD CONSTRAINT "WorkoutSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSession" ADD CONSTRAINT "WorkoutSession_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
