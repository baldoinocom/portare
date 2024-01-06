'use server'

import { Fleet } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: Fleet[] }> => {
  const fleets = await db.fleet.findMany({ include: { company: true } })

  return { data: fleets }
}
