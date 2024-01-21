'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
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
    trip = await db.trip.create({
      data: {
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
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/trips')

  return { data: trip }
}

export const createAction = safeAction(TripSchema, handler)
