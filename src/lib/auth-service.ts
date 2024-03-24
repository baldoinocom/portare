import { UserResource, userResource } from '@/actions/types'
import { db } from '@/lib/db'
import { extractPermission, PermissionGroupCode } from '@/permissions'
import { currentUser as currentUserClerk } from '@clerk/nextjs'
import { Permission, PermissionGuard } from '@prisma/client'

export const authenticated = async (): Promise<boolean> => {
  const clerkUser = await currentUserClerk()

  return Boolean(clerkUser?.username)
}

export const currentUser = async (): Promise<UserResource> => {
  const clerkUser = await currentUserClerk()

  if (!clerkUser?.username) throw new Error('Unauthorized')

  const user = await db.user.findUnique({
    where: { externalUserId: clerkUser.id },
    include: userResource.include,
  })

  if (!user) throw new Error('Not found')

  return user
}

export const userPermissions = async (): Promise<Permission[]> => {
  const clerkUser = await currentUserClerk()

  const user = await db.user.findUniqueOrThrow({
    where: { externalUserId: clerkUser?.id },
    select: {
      groups: { select: { roles: { select: { permissions: true } } } },
    },
  })

  return user.groups.reduce((acc: Permission[], group) => {
    const groupPermissions = group.roles.reduce((acc: Permission[], role) => {
      return [...acc, ...role.permissions]
    }, [])

    return [...acc, ...groupPermissions]
  }, [])
}

export const checkUserPermission = async ({
  permission,
  guard,
}: {
  permission?: PermissionGroupCode
  guard?: PermissionGuard
}): Promise<boolean> => {
  if (!permission || !guard) return false

  const clerkUser = await currentUserClerk()

  const { group, code } = extractPermission(permission)

  const user = await db.user.findUniqueOrThrow({
    where: {
      externalUserId: clerkUser?.id,
      groups: {
        some: {
          roles: { some: { permissions: { some: { group, code, guard } } } },
        },
      },
    },
  })

  return Boolean(user)
}
