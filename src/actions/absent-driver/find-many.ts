'use server'

import { AbsentDriver } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: AbsentDriver[] }> => {
  const absentDrivers = await db.absentDriver.findMany({
    include: { driver: { include: { person: true } } },
  })

  return { data: absentDrivers }
}
