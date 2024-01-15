'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { ASO } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ASOIdSchema } from './schema'

type InputType = z.infer<typeof ASOIdSchema>
type ReturnType = ActionState<InputType, ASO>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, driverId } = data

  let aso

  try {
    aso = await db.aSO.delete({
      where: { id_driverId: { id, driverId } },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/aso')

  return { data: aso }
}

export const deleteAction = safeAction(ASOIdSchema, handler)
