'use server'

import { currentUser } from '@/lib/auth-service'
import { db } from '@/lib/db'
import { Permission } from '@prisma/client'

export const listAction = async (): Promise<{ data: Permission[] }> => {
  let permissions

  try {
    const { id } = await currentUser()

    const user = await db.user.findUniqueOrThrow({
      where: { externalUserId: id },
      select: {
        groups: { select: { roles: { select: { permissions: true } } } },
      },
    })

    permissions = user.groups.reduce((acc: Permission[], group) => {
      const groupPermissions = group.roles.reduce((acc: Permission[], role) => {
        return [...acc, ...role.permissions]
      }, [])

      return [...acc, ...groupPermissions]
    }, [])
  } catch (error) {
    return { data: [] }
  }

  return { data: permissions }
}
