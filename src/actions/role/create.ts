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
import { RoleSchema } from './schema'

type InputType = z.infer<typeof RoleSchema>
type ReturnType = ActionState<InputType, Role>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, permissions } = data

  let role

  try {
    const find = await db.role.findFirst({ where: { name } })

    if (find) {
      return { error: 'Já existe uma função com esse nome' }
    }

    role = await db.role.create({
      data: {
        name,
        permissions: {
          connect:
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
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/system/roles')

  return { data: role }
}

export const createAction = safeAction(RoleSchema, handler)
