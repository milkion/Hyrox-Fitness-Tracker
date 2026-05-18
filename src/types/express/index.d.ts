// treat the file as a module
import type { PlanItem } from '../../../generated/prisma/client'
import type { Difficulty } from '../../../generated/prisma/enums'

declare module 'express-serve-static-core' {
  interface Request {
    userId: string
    planId: string
    name: string
    description: string
    difficulty: Difficulty
    planItem: PlanItem[]
  }
}
