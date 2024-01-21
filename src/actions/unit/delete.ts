'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Unit } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UnitIdSchema } from './schema'

type InputType = z.infer<typeof UnitIdSchema>
type ReturnType = ActionState<InputType, Unit>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { companyId } = data

  let unit

  try {
    unit = await db.unit.delete({ where: { companyId } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/units')

  return { data: unit }
}

export const deleteAction = safeAction(UnitIdSchema, handler)
