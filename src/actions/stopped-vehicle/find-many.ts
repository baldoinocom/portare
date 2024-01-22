'use server'

import { StoppedVehicleInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: StoppedVehicleInclude[]
}> => {
  const stoppedVehicles = await db.stoppedVehicle.findMany({
    include: { vehicle: { include: { brand: true } } },
  })

  return { data: stoppedVehicles }
}
