'use server'

import { currentUser } from '@/lib/auth-service'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { PermissionGroupCode, extractPermission } from '@/permissions'
import { PermissionGuard } from '@prisma/client'
import { z } from 'zod'
import { PermissionCheckSchema } from './schema'

type InputType = z.infer<typeof PermissionCheckSchema>
type ReturnType = ActionState<InputType, boolean>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { permission, guard } = data as {
    permission: PermissionGroupCode
    guard: PermissionGuard
  }

  let check: boolean

  try {
    const user = await currentUser()

    const { group, code } = extractPermission(permission)

    const find = await db.user.findUniqueOrThrow({
      where: {
        externalUserId: user.id,
        groups: {
          some: {
            roles: {
              some: {
                permissions: {
                  some: { group, code, guard },
                },
              },
            },
          },
        },
      },
    })

    check = Boolean(find)
  } catch (error) {
    return { data: false }
  }

  return { data: check }
}

export const checkAction = safeAction(PermissionCheckSchema, handler)
