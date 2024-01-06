'use server'

import { db } from '@/lib/db'
import { Trailer } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: Trailer[] }> => {
  const trailers = await db.trailer.findMany({
    include: { vehicle: { include: { brand: true, fleet: true } } },
  })

  return { data: trailers }
}
