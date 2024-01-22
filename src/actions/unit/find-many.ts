'use server'

import { UnitInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: UnitInclude[] }> => {
  const units = await db.unit.findMany({ include: { company: true } })

  return { data: units }
}
