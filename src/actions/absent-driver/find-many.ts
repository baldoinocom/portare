'use server'

import { AbsentDriverResource, absentDriverResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: AbsentDriverResource[]
}> => {
  const absentDrivers = await db.absentDriver.findMany(absentDriverResource)

  return { data: absentDrivers }
}
