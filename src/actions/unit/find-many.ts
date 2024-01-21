'use server'

import { Unit } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: Unit[] }> => {
  const units = await db.unit.findMany({ include: { company: true } })

  return { data: units }
}
