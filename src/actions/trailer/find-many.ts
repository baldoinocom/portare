'use server'

import { Trailer } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: Trailer[] }> => {
  const trailers = await db.trailer.findMany({
    include: { vehicle: { include: { brand: true, fleet: true } } },
  })

  return { data: trailers }
}
