// handles the HTTP layers (req, res, status etc. )
import type { Request, Response } from 'express'
import { login, signUp } from '../services/authService'
import { LoginValidator, SignUpValidator } from '../validators/auth'

export async function signUpController(req: Request, res: Response) {
  const result = SignUpValidator.safeParse(req.body)
  if (result.error) {
    return res.status(400).json({ error: result.error.message })
  }

  try {
    const user = await signUp({
      ...result.data,
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
  const result = LoginValidator.safeParse(req.body)
  if (result.error) {
    return res.status(400).json({ error: result.error.message })
  }
  try {
    const userToken = await login({ ...result.data })
    return res.status(200).json(userToken)
  } catch (error) {
    return res.status(401).json({ error: (error as Error).message })
  }
}
