'use server'

import { TripInclude } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { TripIdSchema } from './schema'

type InputType = z.infer<typeof TripIdSchema>
type ReturnType = ActionState<InputType, TripInclude>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let trip

  try {
    trip = await db.trip.findUniqueOrThrow({
      where: { id },
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
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: trip }
}

export const findAction = safeAction(TripIdSchema, handler)
