'use server'

import { DriverResource, driverResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: DriverResource[] }> => {
  const drivers = await db.driver.findMany(driverResource)

  return { data: drivers }
}
