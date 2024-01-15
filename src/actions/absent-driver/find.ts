'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { AbsentDriver } from '@prisma/client'
import { z } from 'zod'
import { AbsentDriverIdSchema } from './schema'

type InputType = z.infer<typeof AbsentDriverIdSchema>
type ReturnType = ActionState<InputType, AbsentDriver>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, driverId } = data

  let absentDriver

  try {
    absentDriver = await db.absentDriver.findUniqueOrThrow({
      where: { id_driverId: { id, driverId } },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: absentDriver }
}

export const findAction = safeAction(AbsentDriverIdSchema, handler)
