import { db } from '@/lib/db'

export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
    include: { person: true },
  })

  return user
}
