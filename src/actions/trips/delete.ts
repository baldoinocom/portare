'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Trip } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TripIdSchema } from './schema'

type InputType = z.infer<typeof TripIdSchema>
type ReturnType = ActionState<InputType, Trip>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let trip

  try {
    trip = await db.trip.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/trips')

  return { data: trip }
}

export const deleteAction = safeAction(TripIdSchema, handler)
