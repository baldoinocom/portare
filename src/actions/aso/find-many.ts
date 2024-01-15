'use server'

import { db } from '@/lib/db'
import { ASO } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: ASO[] }> => {
  const aso = await db.aSO.findMany()

  return { data: aso }
}
