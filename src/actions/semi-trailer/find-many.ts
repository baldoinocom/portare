'use server'

import { SemiTrailerResource, semiTrailerResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: SemiTrailerResource[]
}> => {
  const semiTrailers = await db.semiTrailer.findMany(semiTrailerResource)

  return { data: semiTrailers }
}
