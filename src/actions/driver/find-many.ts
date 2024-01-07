'use server'

import { Driver } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: Driver[] }> => {
  const drivers = await db.driver.findMany({ include: { person: true } })

  return { data: drivers }
}
