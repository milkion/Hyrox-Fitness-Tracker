import express from 'express'
import {
  createPlanController,
  deletePlanController,
  forkPlanController,
  getPlanController,
  getPlansController,
  updatePlanController,
} from '../controllers/planController'
import { requireAuth } from '../middleware/requireAuth'

export const planRouter = express.Router()

planRouter.get('/', requireAuth, getPlansController)
planRouter.get('/:planId', requireAuth, getPlanController)
planRouter.post('/', requireAuth, createPlanController)
planRouter.post('/:planId/fork', requireAuth, forkPlanController)
planRouter.patch('/:planId', requireAuth, updatePlanController)
planRouter.delete('/:planId', requireAuth, deletePlanController)
