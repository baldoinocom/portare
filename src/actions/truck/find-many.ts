'use server'

import { TruckResource, truckResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: TruckResource[] }> => {
  const trucks = await db.truck.findMany(truckResource)

  return { data: trucks }
}
