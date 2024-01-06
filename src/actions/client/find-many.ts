'use server'

import { db } from '@/lib/db'
import { Client } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: Client[] }> => {
  const clients = await db.client.findMany({ include: { company: true } })

  return { data: clients }
}
