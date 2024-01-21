'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { AbsentDriver } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AbsentDriverUpdateSchema } from './schema'

type InputType = z.infer<typeof AbsentDriverUpdateSchema>
type ReturnType = ActionState<InputType, AbsentDriver>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, driverId, startedAt, endedAt, status, note } = data

  let absentDriver

  try {
    absentDriver = await db.absentDriver.update({
      where: { id_driverId: { id, driverId } },
      data: { startedAt, endedAt, status, note },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/absent-drivers/${id}`)
  revalidatePath('/absent-drivers')

  return { data: absentDriver }
}

export const updateAction = safeAction(AbsentDriverUpdateSchema, handler)
