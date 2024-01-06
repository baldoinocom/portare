'use server'

import { Aggregate } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: Aggregate[] }> => {
  const aggregates = await db.aggregate.findMany({
    include: { company: true, person: true, fleet: true },
  })

  return { data: aggregates as Aggregate[] }
}
