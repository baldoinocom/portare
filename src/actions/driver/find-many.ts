'use server'

import { DriverInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: DriverInclude[] }> => {
  const drivers = await db.driver.findMany({ include: { person: true } })

  return { data: drivers }
}
