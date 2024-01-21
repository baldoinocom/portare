'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { AbsentDriver } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AbsentDriverWithDateRangeSchema } from './schema'

type InputType = z.infer<typeof AbsentDriverWithDateRangeSchema>
type ReturnType = ActionState<InputType, AbsentDriver>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { driverId, startedAt, endedAt, status, note } = data

  let absentDriver

  try {
    absentDriver = await db.absentDriver.create({
      data: { driverId, startedAt, endedAt, status, note },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/absent-drivers')

  return { data: absentDriver }
}

export const createAction = safeAction(AbsentDriverWithDateRangeSchema, handler)
