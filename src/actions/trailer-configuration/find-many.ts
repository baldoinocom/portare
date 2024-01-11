'use server'

import { db } from '@/lib/db'
import { TrailerConfiguration } from '@prisma/client'

export const findManyAction = async (): Promise<{
  data: TrailerConfiguration[]
}> => {
  const trailerConfigurations = await db.trailerConfiguration.findMany()

  return { data: trailerConfigurations }
}
