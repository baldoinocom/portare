'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Driver } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { DriverIdSchema } from './schema'

type InputType = z.infer<typeof DriverIdSchema>
type ReturnType = ActionState<InputType, Driver>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { personId } = data

  let driver

  try {
    driver = await db.driver.delete({ where: { personId } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/drivers')

  return { data: driver }
}

export const deleteAction = safeAction(DriverIdSchema, handler)
