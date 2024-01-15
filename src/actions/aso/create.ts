'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { ASO } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ASOSchema } from './schema'

type InputType = z.infer<typeof ASOSchema>
type ReturnType = ActionState<InputType, ASO>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { driverId, startedAt, expirationType } = data

  let aso

  try {
    aso = await db.aSO.create({ data: { driverId, startedAt, expirationType } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/aso')

  return { data: aso }
}

export const createAction = safeAction(ASOSchema, handler)
