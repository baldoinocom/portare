'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { AbsentDriver } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AbsentDriverIdSchema } from './schema'

type InputType = z.infer<typeof AbsentDriverIdSchema>
type ReturnType = ActionState<InputType, AbsentDriver>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, driverId } = data

  let absentDriver

  try {
    absentDriver = await db.absentDriver.delete({
      where: { id_driverId: { id, driverId } },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/absent-drivers')

  return { data: absentDriver }
}

export const deleteAction = safeAction(AbsentDriverIdSchema, handler)
