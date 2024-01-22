'use server'

import { VehicleInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: VehicleInclude[] }> => {
  const vehicles = await db.vehicle.findMany({ include: { brand: true } })

  return { data: vehicles }
}
