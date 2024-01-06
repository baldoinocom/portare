'use server'

import { db } from '@/lib/db'
import { Truck } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: Truck[] }> => {
  const trucks = await db.truck.findMany({
    include: {
      vehicle: { include: { brand: true, fleet: true, aggregate: true } },
    },
  })

  return { data: trucks }
}
