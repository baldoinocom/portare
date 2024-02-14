'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import clerk, { User } from '@clerk/clerk-sdk-node'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UserSchema } from './schema'

type InputType = z.infer<typeof UserSchema>
type ReturnType = ActionState<InputType, User>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { username, password } = data

  let user

  try {
    if (username) {
      const find = await db.user.findFirst({ where: { username } })

      if (find) return { error: 'Já existe um usuário com esse nome' }
    }

    user = await clerk.users.createUser({
      username,
      password,
      skipPasswordChecks: true,
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/users')

  return { data: JSON.parse(JSON.stringify(user)) }
}

export const createAction = safeAction(UserSchema, handler)
