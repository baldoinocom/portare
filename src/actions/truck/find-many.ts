'use server'

import { TruckInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: TruckInclude[] }> => {
  const trucks = await db.truck.findMany({
    include: {
      vehicle: {
        include: {
          brand: true,
          unit: { include: { company: true } },
          aggregate: { include: { person: true, company: true } },
        },
      },
    },
  })

  return { data: trucks }
}
