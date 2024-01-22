import { UserInclude } from '@/actions/types'
import { db } from '@/lib/db'
import { currentUser as currentUserClerk } from '@clerk/nextjs'

export const currentUser = async (): Promise<UserInclude> => {
  const clerkUser = await currentUserClerk()

  if (!clerkUser || !clerkUser.username) throw new Error('Unauthorized')

  const user = await db.user.findUnique({
    where: { externalUserId: clerkUser.id },
    include: { person: true },
  })

  if (!user) throw new Error('Not found')

  return user
}
