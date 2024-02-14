'use server'

import { TripResource, tripResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async ({
  draft,
}: {
  draft?: boolean
} = {}): Promise<{ data: TripResource[] }> => {
  const trips = await db.trip.findMany({
    where: { draft },
    include: tripResource.include,
  })

  return { data: trips }
}
