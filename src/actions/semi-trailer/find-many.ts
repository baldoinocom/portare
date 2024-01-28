'use server'

import { SemiTrailerInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: SemiTrailerInclude[]
}> => {
  const semiTrailers = await db.semiTrailer.findMany({
    include: {
      configuration: true,
      type: true,
      cargos: true,
      trailers: {
        include: {
          vehicle: {
            include: { brand: true, unit: { include: { company: true } } },
          },
        },
      },
    },
  })

  return { data: semiTrailers }
}
