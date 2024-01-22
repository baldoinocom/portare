'use server'

import { AggregateInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: AggregateInclude[]
}> => {
  const aggregates = await db.aggregate.findMany({
    include: { company: true, person: true, unit: true },
  })

  return { data: aggregates }
}
