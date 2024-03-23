import { db } from '@/lib/db'
import { useShield } from '@/store/use-shield'
import { currentUser } from '@clerk/nextjs'
import { Permission } from '@prisma/client'
import { ShieldClientProvider } from './client'

export const ShieldProvider = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const data = useShield.getState().permissions

  if (!data?.length) {
    const user = await currentUser()

    if (user) {
      const find = await db.user.findUnique({
        where: { id: user.id },
        select: {
          groups: { select: { roles: { select: { permissions: true } } } },
        },
      })

      if (find) {
        find.groups.reduce((acc: Permission[], group) => {
          const groupPermissions = group.roles.reduce(
            (acc: Permission[], role) => {
              return [...acc, ...role.permissions]
            },
            [],
          )

          return [...acc, ...groupPermissions]
        }, [])
      }
    }

    useShield.setState({ permissions: data })
  }

  return (
    <ShieldClientProvider permissions={data}>{children}</ShieldClientProvider>
  )
}
