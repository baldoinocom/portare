'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import clerk, { User } from '@clerk/clerk-sdk-node'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UserUpdateSchema } from './schema'

type InputType = z.infer<typeof UserUpdateSchema>
type ReturnType = ActionState<InputType, User>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { externalUserId, username, password } = data

  let user

  try {
    if (username) {
      const find = await db.user.findFirst({
        where: { NOT: { externalUserId }, username },
      })

      if (find) return { error: 'Já existe um usuário com esse nome' }
    }

    user = await clerk.users.updateUser(externalUserId, {
      username,
      password: emptyAsNull(password) || undefined,
      skipPasswordChecks: true,
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath('/users')

  return { data: JSON.parse(JSON.stringify(user)) }
}

export const updateAction = safeAction(UserUpdateSchema, handler)
