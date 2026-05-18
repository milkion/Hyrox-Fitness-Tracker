import type { Request, Response } from 'express'
import {
  createPlan,
  deletePlan,
  forkPlan,
  getAllPlans,
  getPlan,
  getUserPlans,
  updatePlan,
} from '../services/planService'

export async function getPlansController(req: Request, res: Response) {
  try {
    const userId = req.userId
    const systemPlans = await getAllPlans()
    const userPlans = await getUserPlans(userId)
    return res.status(200).json({ systemPlans, userPlans })
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message })
  }
}

export async function getPlanController(req: Request, res: Response) {
  try {
    const planId = req.params.planId
    const result = await getPlan(planId as string)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message })
  }
}

export async function createPlanController(req: Request, res: Response) {
  const { name, description, difficulty, planItem } = req.body
  const userId = req.userId
  try {
    const result = await createPlan({
      userId,
      name,
      description,
      difficulty,
      planItem,
    })

    return res.status(201).json(result)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}

export async function forkPlanController(req: Request, res: Response) {
  const planId = req.params.planId
  const userId = req.userId
  try {
    const result = await forkPlan(planId as string, userId)

    return res.status(201).json(result)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}

export async function updatePlanController(req: Request, res: Response) {
  const { name, description, difficulty, planItem } = req.body
  const userId = req.userId
  const planId = req.params.planId as string
  try {
    const result = await updatePlan({
      userId,
      planId,
      name,
      description,
      difficulty,
      planItem,
    })

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message })
  }
}

export async function deletePlanController(req: Request, res: Response) {
  const planId = req.params.planId
  try {
    const result = await deletePlan(planId as string)
    return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message })
  }
}
