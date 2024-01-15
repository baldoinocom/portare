'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { ASO } from '@prisma/client'
import { z } from 'zod'
import { ASOIdSchema } from './schema'

type InputType = z.infer<typeof ASOIdSchema>
type ReturnType = ActionState<InputType, ASO>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, driverId } = data

  let aso

  try {
    aso = await db.aSO.findUniqueOrThrow({
      where: { id_driverId: { id, driverId } },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: aso }
}

export const findAction = safeAction(ASOIdSchema, handler)
