'use server'

import { db } from '@/lib/db'
import { Driver } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: Driver[] }> => {
  const drivers = await db.driver.findMany({
    include: { person: true },
  })

  return { data: drivers }
}
