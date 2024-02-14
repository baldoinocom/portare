'use server'

import { StoppedVehicleResource, stoppedVehicleResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: StoppedVehicleResource[]
}> => {
  const stoppedVehicles = await db.stoppedVehicle.findMany(
    stoppedVehicleResource,
  )

  return { data: stoppedVehicles }
}
