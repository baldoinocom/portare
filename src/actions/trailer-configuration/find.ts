'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerConfiguration } from '@prisma/client'
import { z } from 'zod'
import { TrailerConfigurationIdSchema } from './schema'

type InputType = z.infer<typeof TrailerConfigurationIdSchema>
type ReturnType = ActionState<InputType, TrailerConfiguration>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let trailerConfiguration

  try {
    trailerConfiguration = await db.trailerConfiguration.findUniqueOrThrow({
      where: { id },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: trailerConfiguration }
}

export const findAction = safeAction(TrailerConfigurationIdSchema, handler)
