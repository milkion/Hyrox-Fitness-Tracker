// handles the HTTP layers (req, res, status etc. )
import type { Request, Response } from 'express'
import { login, signUp } from '../services/authService'

export async function signUpController(req: Request, res: Response) {
  const { firstName, lastName, email, password, fitnessLevel } = req.body

  try {
    const user = await signUp({
      firstName,
      lastName,
      email,
      password,
      fitnessLevel,
    })

    const { hashedPassword, ...userFields } = user
    return res.status(201).json(userFields)
  } catch (error) {
    if ((error as Error).message === 'Email already exists!') {
      return res.status(409).json({ error: 'Email already exists!' })
    }
    return res.status(500).json({ error: (error as Error).message })
  }
}

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body

  try {
    const userToken = await login({ email, password })
    return res.status(200).json(userToken)
  } catch (error) {
    return res.status(401).json({ error: (error as Error).message })
  }
}
