'use server'

import { groupResource, GroupResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: GroupResource[] }> => {
  const groups = await db.group.findMany(groupResource)

  return { data: groups }
}
