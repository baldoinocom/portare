'use server'

import { db } from '@/lib/db'
import { Cargo } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: Cargo[] }> => {
  const cargos = await db.cargo.findMany()

  return { data: cargos }
}
