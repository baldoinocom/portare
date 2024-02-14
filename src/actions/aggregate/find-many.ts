'use server'

import { AggregateResource, aggregateResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: AggregateResource[]
}> => {
  const aggregates = await db.aggregate.findMany(aggregateResource)

  return { data: aggregates }
}
