'use server'

import { GroupingResource, groupingResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: GroupingResource[]
}> => {
  const groupings = await db.grouping.findMany(groupingResource)

  return { data: groupings }
}
