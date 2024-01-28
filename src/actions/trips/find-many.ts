'use server'

import { TripInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: TripInclude[] }> => {
  const trips = await db.trip.findMany({
    include: {
      origin: { include: { company: true } },
      destination: { include: { company: true } },
      driver: { include: { person: true } },
      truck: { include: { vehicle: { include: { brand: true } } } },
      semiTrailer: {
        include: {
          type: true,
          configuration: true,
          cargos: true,
          trailers: { include: { vehicle: { include: { brand: true } } } },
        },
      },
      cargo: true,
      unit: { include: { company: true } },
      aggregate: { include: { person: true, company: true } },
    },
  })

  return { data: trips }
}
