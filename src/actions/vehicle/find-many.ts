'use server'

import { VehicleResource, vehicleResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: VehicleResource[]
}> => {
  const vehicles = await db.vehicle.findMany(vehicleResource)

  return { data: vehicles }
}
