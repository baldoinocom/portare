'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import {
  PermissionCode,
  PermissionGroup,
  PermissionGuard,
  Role,
} from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { RoleUpdateSchema } from './schema'

type InputType = z.infer<typeof RoleUpdateSchema>
type ReturnType = ActionState<InputType, Role>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, name, permissions } = data

  let role

  try {
    if (name) {
      const find = await db.role.findFirst({ where: { NOT: { id }, name } })

      if (find) {
        return { error: 'Já existe um cargo com esse nome' }
      }
    }

    role = await db.role.update({
      where: { id },
      data: {
        name,
        permissions: {
          set:
            permissions?.map(({ group, code, guard }) => ({
              group_code_guard: {
                group: group as PermissionGroup,
                code: code as PermissionCode,
                guard: guard as PermissionGuard,
              },
            })) || [],
        },
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/system/roles/${id}`)
  revalidatePath('/system/roles')

  return { data: role }
}

export const updateAction = safeAction(RoleUpdateSchema, handler)
