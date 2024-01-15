'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TrailerTypeIdSchema } from './schema'

type InputType = z.infer<typeof TrailerTypeIdSchema>
type ReturnType = ActionState<InputType, TrailerType>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let trailerType

  try {
    trailerType = await db.trailerType.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/trailer-types')

  return { data: trailerType }
}

export const deleteAction = safeAction(TrailerTypeIdSchema, handler)
