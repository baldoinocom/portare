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
  let permissions: Permission[] = []

  const clerkUser = await currentUserClerk()

  if (clerkUser) {
    const user = await db.user.findUnique({
      where: { externalUserId: clerkUser.id },
      select: {
        groups: { select: { roles: { select: { permissions: true } } } },
      },
    })

    if (user) {
      permissions = user.groups.reduce((acc: Permission[], { roles }) => {
        const groupPermissions = roles.reduce(
          (acc: Permission[], { permissions }) => [...acc, ...permissions],
          [],
        )

        return [...acc, ...groupPermissions]
      }, [])
    }
  }

  return permissions
}

export const checkUserPermission = async ({
  permission,
  guard,
}: {
  permission?: PermissionGroupCode
  guard?: PermissionGuard
}): Promise<boolean> => {
  if (permission && guard) {
    const clerkUser = await currentUserClerk()

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
