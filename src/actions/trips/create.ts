'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Trip } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TripSchema } from './schema'

type InputType = z.infer<typeof TripSchema>
type ReturnType = ActionState<InputType, Trip>

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    order,
    note,
    departedAt,
    arrivedAt,
    status,
    originId,
    destinationId,
    driverId,
    truckId,
    semiTrailerId,
    cargoId,
  } = data

  let trip

  try {
    if (truckId && semiTrailerId) {
      const truckAxle = (
        await db.truck.findUnique({
          where: { id: truckId },
          select: { vehicle: { select: { axle: true } } },
        })
      )?.vehicle?.axle

      const trailerAxle = (
        await db.semiTrailer.findUnique({
          where: { id: semiTrailerId },
          select: {
            trailers: { select: { vehicle: { select: { axle: true } } } },
          },
        })
      )?.trailers?.at(0)?.vehicle.axle

      if (truckAxle === 4 && trailerAxle === 4) {
        return {
          error:
            'O número de eixos do caminhão e do semirreboque não coincidem',
        }
      }
    }

    trip = await db.trip.create({
      data: {
        order: emptyAsNull(order),
        note: emptyAsNull(note),
        departedAt,
        arrivedAt,
        status,
        originId,
        destinationId,
        driverId,
        truckId,
        semiTrailerId,
        cargoId,
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/trips')

  return { data: trip }
}

export const createAction = safeAction(TripSchema, handler)
