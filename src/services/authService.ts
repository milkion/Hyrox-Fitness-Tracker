// BUSINESS LOGIC ex: handles hashing passwords, generating tokens, encryption
import * as argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { prisma } from '../lib/prisma'

type signUpProps = {
  firstName: string
  lastName: string
  email: string
  password: string
  fitnessLevel?: number | undefined
}

type loginProps = {
  email: string
  password: string
}

export async function signUp({
  firstName,
  lastName,
  email,
  password,
  fitnessLevel,
}: signUpProps) {
  const emailExists =
    (await prisma.user.count({
      where: {
        email: email,
      },
    })) > 0

  if (emailExists) {
    throw new Error('Email already exists!')
  }

  try {
    const hashedPassword = await argon2.hash(password)
    const newUser = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        hashedPassword: hashedPassword,
        fitnessLevel: fitnessLevel ?? null,
      },
    })
    return newUser
  } catch (error) {
    throw new Error('Error creating a new user', { cause: error })
  }
}

export async function login({ email, password }: loginProps) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (!user) {
    throw new Error('Error logging in! Please try again')
  }

  const isPasswordValid = await argon2.verify(user.hashedPassword, password)

  if (!isPasswordValid) {
    throw new Error('Error logging in! Please try again')
  }

  const secretKey = process.env.SECRET_KEY as jwt.Secret
  const token = jwt.sign({ userId: user.uuid }, secretKey, {
    expiresIn: '1d',
  })

  return token
}
