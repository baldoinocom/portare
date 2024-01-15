'use server'

import { db } from '@/lib/db'
import { AbsentDriver } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: AbsentDriver[] }> => {
  const absentDrivers = await db.absentDriver.findMany()

  return { data: absentDrivers }
}
