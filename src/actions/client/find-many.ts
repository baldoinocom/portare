'use server'

import { Client } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: Client[] }> => {
  const clients = await db.client.findMany({ include: { company: true } })

  return { data: clients }
}
