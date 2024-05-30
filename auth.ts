import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import Credentials from 'next-auth/providers/credentials'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function getUser(email: string): Promise<any> {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: email
      }
    })
    return user
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw new Error('Failed to fetch user.')
  }
}

async function setUser({
  email,
  password
}: {
  email: string
  password: string
}): Promise<any> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.users.create({
      data: {
        name: 'user',
        email: email,
        password: hashedPassword
      }
    })
  } catch (error) {
    console.error('Failed to create user:', error)
    throw new Error('Failed to create user.')
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<any> {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)
          if (!user) return null
          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) return user
        }

        return null
      }
    })
  ]
})

export const signUp = async (credentials: {
  email: string
  password: string
}): Promise<any> => {
  const parsedCredentials = z
    .object({ email: z.string().email(), password: z.string().min(6) })
    .safeParse(credentials)

  if (parsedCredentials.success) {
    return await setUser(parsedCredentials.data)
  }

  return null
}
