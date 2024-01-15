'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { ASO } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ASOUpdateSchema } from './schema'

type InputType = z.infer<typeof ASOUpdateSchema>
type ReturnType = ActionState<InputType, ASO>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, driverId, startedAt, expirationType } = data

  let aso

  try {
    aso = await db.aSO.update({
      where: { id_driverId: { id, driverId } },
      data: { startedAt, expirationType },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/aso/${id}`)
  revalidatePath('/aso')

  return { data: aso }
}

export const updateAction = safeAction(ASOUpdateSchema, handler)
