'use server'

import { db } from '@/lib/db'
import { extractPermission, PermissionGroupCode } from '@/permissions'
import { currentUser } from '@clerk/nextjs'
import { PermissionGuard } from '@prisma/client'

export const checkUserAction = async ({
  permission,
  guard,
}: {
  permission?: PermissionGroupCode
  guard?: PermissionGuard
}): Promise<boolean> => {
  if (permission && guard) {
    const clerkUser = await currentUser()

    const { group, code } = extractPermission(permission)

    if (clerkUser) {
      const user = await db.user.findUnique({
        where: {
          externalUserId: clerkUser.id,
          groups: {
            some: {
              roles: {
                some: { permissions: { some: { group, code, guard } } },
              },
            },
          },
        },
      })

      if (user) return true
    }
  }

  return false
}
