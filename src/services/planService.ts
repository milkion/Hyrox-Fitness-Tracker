import type { PlanItem } from '../../generated/prisma/client'
import type { Difficulty } from '../../generated/prisma/enums'
import { prisma } from '../lib/prisma'

type CreatePlanProps = {
  userId: string
  name: string
  description: string
  difficulty: Difficulty
  planItem: PlanItem[]
}

type UpdatePlanPros = {
  userId: string
  planId: string
  name?: string
  description?: string
  difficulty?: Difficulty
  planItem?: PlanItem[]
}

export async function getAllPlans() {
  try {
    const res = await prisma.plan.findMany({
      where: {
        userId: null,
      },
      include: {
        planItem: true,
      },
    })
    return res
  } catch (error) {
    throw new Error('Error getting all plans: ', { cause: error })
  }
}

export async function getPlan(planId: string) {
  try {
    const res = await prisma.plan.findUnique({
      where: {
        uuid: planId,
      },
      include: {
        planItem: true,
      },
    })

    if (!res) {
      throw new Error("Plan doesn't exists!")
    }

    return res
  } catch (error) {
    throw new Error('Error retreiving plan: ', { cause: error })
  }
}

export async function getUserPlans(userId: string) {
  try {
    const res = await prisma.plan.findMany({
      where: {
        userId: userId,
      },
      include: {
        planItem: true,
      },
    })

    return res
  } catch (error) {
    throw new Error('Error getting user plans: ', { cause: error })
  }
}

export async function createPlan({
  userId,
  name,
  description,
  difficulty,
  planItem,
}: CreatePlanProps) {
  try {
    const res = await prisma.plan.create({
      data: {
        userId: userId,
        planName: name,
        description: description,
        difficulty: difficulty,
        planItem: {
          create: planItem,
        },
      },
    })

    return res
  } catch (error) {
    throw new Error('Error creating new plan: ', { cause: error })
  }
}

export async function forkPlan(planId: string, userId: string) {
  try {
    const plan = await prisma.plan.findUnique({
      where: {
        uuid: planId,
      },
      include: {
        planItem: true,
      },
    })

    if (!plan) {
      throw new Error("Plan doesn't exists!")
    }

    const forkedPlan = await prisma.plan.create({
      data: {
        userId: userId,
        planName: `${plan.planName}-copy`,
        description: plan.description,
        difficulty: plan.difficulty,
        forkedFromId: plan.uuid,
        planItem: {
          create: plan.planItem.map((item) => ({
            order: item.order,
            exerciseId: item.exerciseId,
            distance: item.distance,
            reps: item.reps,
            sets: item.sets,
            weight: item.weight,
          })),
        },
      },
    })

    return forkedPlan
  } catch (error) {
    throw new Error('Error forking plan: ', { cause: error })
  }
}

export async function updatePlan({
  userId,
  planId,
  name,
  description,
  difficulty,
  planItem,
}: UpdatePlanPros) {
  try {
    const plan = await prisma.plan.findUnique({
      where: {
        uuid: planId,
      },
      include: {
        planItem: true,
      },
    })

    if (!plan) {
      throw new Error("Plan doesn't exists!")
    }

    if (!plan.userId) {
      throw new Error('System predefined plan cannot be modified!')
    }

    if (userId !== plan.userId) {
      throw new Error("You don't have permission to edit this plan!")
    }

    const updatePlanOnly = prisma.plan.update({
      where: {
        uuid: planId,
      },
      data: {
        planName: name ?? plan.planName,
        description: description ?? plan.description,
        difficulty: difficulty ?? plan.difficulty,
      },
    })

    if (planItem) {
      const deletePlanItem = prisma.planItem.deleteMany({
        where: {
          planId: planId,
        },
      })

      const updatePlanItem = prisma.plan.update({
        where: {
          uuid: planId,
        },
        data: {
          planItem: {
            create: planItem,
          },
        },
      })

      await prisma.$transaction([
        updatePlanOnly,
        deletePlanItem,
        updatePlanItem,
      ])
    } else {
      await updatePlanOnly
    }
  } catch (error) {
    throw new Error('Error updating plan: ', { cause: error })
  }
}

export async function deletePlan(planId: string) {
  try {
    const plan = await prisma.plan.findUnique({
      where: {
        uuid: planId,
      },
    })

    if (!plan?.userId) {
      throw new Error('Cannot delete system plan!')
    }

    const res = await prisma.plan.delete({
      where: {
        uuid: planId,
      },
    })

    return res
  } catch (error) {
    throw new Error('Error deleting plan: ', { cause: error })
  }
}
