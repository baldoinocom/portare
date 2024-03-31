'use server'

import { db } from '@/lib/db'
import { extractPermission, PermissionGroupCode } from '@/permissions'
import { currentUser } from '@clerk/nextjs'
import { PermissionGuard } from '@prisma/client'

export const checkUserAction = async ({
  permission,
  guard,
}: {
  permission?: PermissionGroupCode[] | PermissionGroupCode
  guard?: PermissionGuard
}): Promise<boolean> => {
  const clerkUser = await currentUser()

  if (!clerkUser || !permission || !guard) return false

  let user

  if (Array.isArray(permission)) {
    const permissions = permission.map(extractPermission)

    user = await db.user.findUnique({
      where: {
        externalUserId: clerkUser.id,
        groups: {
          some: {
            roles: {
              some: { permissions: { some: { OR: permissions, guard } } },
            },
          },
        },
      },
    })
  } else {
    const { group, code } = extractPermission(permission)

    user = await db.user.findUnique({
      where: {
        externalUserId: clerkUser.id,
        groups: {
          some: {
            roles: { some: { permissions: { some: { group, code, guard } } } },
          },
        },
      },
    })
  }

  return Boolean(user)
}
