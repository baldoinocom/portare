'use server'

import { GroupingInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: GroupingInclude[]
}> => {
  const groupings = await db.grouping.findMany({
    include: {
      driver: { include: { person: true } },
      truck: { include: { vehicle: { include: { brand: true } } } },
      semiTrailer: {
        include: {
          type: true,
          cargos: true,
          configuration: true,
          trailers: { include: { vehicle: { include: { brand: true } } } },
        },
      },
    },
  })

  return { data: groupings }
}
