'use server'

import { TrailerResource, trailerResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: TrailerResource[]
}> => {
  const trailers = await db.trailer.findMany(trailerResource)

  return { data: trailers }
}
