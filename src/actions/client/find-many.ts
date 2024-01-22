'use server'

import { ClientInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: ClientInclude[] }> => {
  const clients = await db.client.findMany({ include: { company: true } })

  return { data: clients }
}
