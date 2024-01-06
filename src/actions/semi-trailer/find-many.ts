'use server'

import { db } from '@/lib/db'
import { SemiTrailer } from '@prisma/client'

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
