'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Trailer } from '@prisma/client'
import { z } from 'zod'
import { TrailerIdSchema } from './schema'

type InputType = z.infer<typeof TrailerIdSchema>
type ReturnType = ActionState<InputType, Trailer>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let trailer

  try {
    trailer = await db.trailer.findUniqueOrThrow({
      where: { id },
      include: { vehicle: { include: { brand: true, fleet: true } } },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: trailer }
}

export const findAction = safeAction(TrailerIdSchema, handler)
