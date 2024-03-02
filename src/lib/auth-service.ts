import { UserResource, userResource } from '@/actions/types'
import { db } from '@/lib/db'
import { currentUser as currentUserClerk } from '@clerk/nextjs'

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
