'use server'

import { ClientResource, clientResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async ({
  type,
}: {
  type?: 'origin' | 'destination'
} = {}): Promise<{ data: ClientResource[] }> => {
  const clients = await db.client.findMany({
    where: type ? { type: { in: [type, 'both'] } } : undefined,
    include: clientResource.include,
  })

  return { data: clients }
}
