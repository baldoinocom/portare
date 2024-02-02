'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Grouping } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { GroupingIdSchema } from './schema'

type InputType = z.infer<typeof GroupingIdSchema>
type ReturnType = ActionState<InputType, Grouping>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let grouping

  try {
    grouping = await db.grouping.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/groupings')

  return { data: grouping }
}

export const deleteAction = safeAction(GroupingIdSchema, handler)
