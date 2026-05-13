import * as z from 'zod'

export const SignUpValidator = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/), // uppercase, lowercase, numbers and symbols
  fitnessLevel: z.number().gte(1).lte(10).optional(),
})

export const LoginValidator = z.object({
  email: z.email(),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/),
})
