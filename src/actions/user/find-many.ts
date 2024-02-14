'use server'

import { UserResource, userResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: UserResource[] }> => {
  const users = await db.user.findMany(userResource)

  return { data: users }
}
