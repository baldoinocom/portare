'use server'

import { roleResource, RoleResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: RoleResource[] }> => {
  const roles = await db.role.findMany(roleResource)

  return { data: roles }
}
