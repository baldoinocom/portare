'use server'

import { SemiTrailer } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: SemiTrailer[] }> => {
  const semiTrailers = await db.semiTrailer.findMany({
    include: {
      configuration: true,
      type: true,
      cargos: true,
      trailers: {
        include: { vehicle: { include: { brand: true, fleet: true } } },
      },
    },
  })

  return { data: semiTrailers }
}
