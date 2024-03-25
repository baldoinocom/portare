'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Group } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { GroupIdSchema } from './schema'

type InputType = z.infer<typeof GroupIdSchema>
type ReturnType = ActionState<InputType, Group>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let group

  try {
    group = await db.group.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/system/groups')

  return { data: group }
}

export const deleteAction = safeAction(GroupIdSchema, handler)
