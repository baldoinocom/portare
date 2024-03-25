'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Role } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { RoleIdSchema } from './schema'

type InputType = z.infer<typeof RoleIdSchema>
type ReturnType = ActionState<InputType, Role>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let role

  try {
    role = await db.role.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/system/roles')

  return { data: role }
}

export const deleteAction = safeAction(RoleIdSchema, handler)
