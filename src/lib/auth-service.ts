import { UserResource, userResource } from '@/actions/types'
import { db } from '@/lib/db'
import { currentUser as currentUserClerk } from '@clerk/nextjs'
import { Permission } from '@prisma/client'

export const authenticated = async (): Promise<boolean> => {
  const clerkUser = await currentUserClerk()

  return Boolean(clerkUser)
}

export const currentUser = async (): Promise<UserResource | undefined> => {
  const clerkUser = await currentUserClerk()

  if (clerkUser) {
    const user = await db.user.findUnique({
      where: { externalUserId: clerkUser.id },
      include: userResource.include,
    })

    if (user) return user
  }
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
