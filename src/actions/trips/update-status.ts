'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Trip } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TripUpdateStatusSchema } from './schema'

type InputType = z.infer<typeof TripUpdateStatusSchema>
type ReturnType = ActionState<InputType, Trip>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, status } = data

  let trip

  try {
    trip = await db.trip.update({ where: { id }, data: { status } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/trips/${id}`)
  revalidatePath('/trips')

  return { data: trip }
}

export const updateStatusAction = safeAction(TripUpdateStatusSchema, handler)
