'use server'

import { db } from '@/lib/db'
import { User } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: User[] }> => {
  const users = await db.user.findMany()

  return { data: users }
}
