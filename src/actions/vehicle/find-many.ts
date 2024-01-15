'use server'

import { Vehicle } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: Vehicle[] }> => {
  const vehicles = await db.vehicle.findMany({ include: { brand: true } })

  return { data: vehicles }
}
