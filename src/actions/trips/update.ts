'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Trip } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TripUpdateSchema } from './schema'

type InputType = z.infer<typeof TripUpdateSchema>
type ReturnType = ActionState<InputType, Trip>

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    id,
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
    trip = await db.trip.update({
      where: { id },
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
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/trips/${id}`)
  revalidatePath('/trips')

  return { data: trip }
}

export const updateAction = safeAction(TripUpdateSchema, handler)
