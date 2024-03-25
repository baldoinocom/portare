'use server'

import { roleResource, RoleResource } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { RoleIdSchema } from './schema'

type InputType = z.infer<typeof RoleIdSchema>
type ReturnType = ActionState<InputType, RoleResource>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let role

  try {
    role = await db.role.findUniqueOrThrow({
      where: { id },
      include: roleResource.include,
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: role }
}

export const findAction = safeAction(RoleIdSchema, handler)
