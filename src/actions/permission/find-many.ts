'use server'

import { db } from '@/lib/db'
import { Permission } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: Permission[] }> => {
  const permissions = await db.permission.findMany()

  return { data: permissions }
}
