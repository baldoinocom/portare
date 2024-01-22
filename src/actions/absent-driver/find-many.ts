'use server'

import { AbsentDriverInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: AbsentDriverInclude[]
}> => {
  const absentDrivers = await db.absentDriver.findMany({
    include: { driver: { include: { person: true } } },
  })

  return { data: absentDrivers }
}
