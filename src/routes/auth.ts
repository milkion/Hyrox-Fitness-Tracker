// defines auth endpoints and delegate them to controller (login, signup etc.)
import express from 'express'
import {
  loginController,
  signUpController,
} from '../controllers/authController'

export const authRouter = express.Router()

authRouter.post('/signup', signUpController)
authRouter.post('/login', loginController)
