'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerType } from '@prisma/client'
import { z } from 'zod'
import { TrailerTypeIdSchema } from './schema'

type InputType = z.infer<typeof TrailerTypeIdSchema>
type ReturnType = ActionState<InputType, TrailerType>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let trailerType

  try {
    trailerType = await db.trailerType.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: trailerType }
}

export const findAction = safeAction(TrailerTypeIdSchema, handler)
