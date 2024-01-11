'use server'

import { db } from '@/lib/db'
import { TrailerType } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: TrailerType[] }> => {
  const trailerTypes = await db.trailerType.findMany()

  return { data: trailerTypes }
}
