'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerConfiguration } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TrailerConfigurationIdSchema } from './schema'

type InputType = z.infer<typeof TrailerConfigurationIdSchema>
type ReturnType = ActionState<InputType, TrailerConfiguration>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let trailerConfiguration

  try {
    trailerConfiguration = await db.trailerConfiguration.delete({
      where: { id },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/trailer-configurations')

  return { data: trailerConfiguration }
}

export const deleteAction = safeAction(TrailerConfigurationIdSchema, handler)
