'use server'

import { TrailerInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: TrailerInclude[] }> => {
  const trailers = await db.trailer.findMany({
    include: {
      vehicle: {
        include: { brand: true, unit: { include: { company: true } } },
      },
    },
  })

  return { data: trailers }
}
