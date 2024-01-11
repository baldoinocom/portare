'use server'

import { Truck } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: Truck[] }> => {
  const trucks = await db.truck.findMany({
    include: {
      vehicle: { include: { brand: true, fleet: true, aggregate: true } },
    },
  })

  return { data: trucks }
}
