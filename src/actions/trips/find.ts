'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Trip } from '@prisma/client'
import { z } from 'zod'
import { TripIdSchema } from './schema'

type InputType = z.infer<typeof TripIdSchema>
type ReturnType = ActionState<InputType, Trip>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let trip

  try {
    trip = await db.trip.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: trip }
}

export const findAction = safeAction(TripIdSchema, handler)
