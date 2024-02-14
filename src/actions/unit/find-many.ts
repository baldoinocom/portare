'use server'

import { UnitResource, unitResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: UnitResource[] }> => {
  const units = await db.unit.findMany(unitResource)

  return { data: units }
}
