'use server'

import { db } from '@/lib/db'
import { Brand } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: Brand[] }> => {
  const brands = await db.brand.findMany()

  return { data: brands }
}
