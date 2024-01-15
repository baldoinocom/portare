'use server'

import { db } from '@/lib/db'
import { Grouping } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: Grouping[] }> => {
  const groupings = await db.grouping.findMany()

  return { data: groupings }
}
