import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  const client = new PrismaClient()

  return client as PrismaClient // Improved type safety
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined // Global declaration
}

export const db = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db
}

export * from '@prisma/client'
