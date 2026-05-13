import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

interface AuthPayload extends jwt.JwtPayload {
  userId: string
}

// handling protected routes
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Error authenticating!' })
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.SECRET_KEY ?? ''
    ) as AuthPayload

    req.userId = payload.userId
    next()
  } catch (error) {
    return res.status(401).json({ error: (error as Error).message })
  }
}
