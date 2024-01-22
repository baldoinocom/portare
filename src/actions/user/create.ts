'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { User } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UserSchema } from './schema'

type InputType = z.infer<typeof UserSchema>
type ReturnType = ActionState<InputType, User>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { username } = data

  let user

  try {
    if (username) {
      const find = await db.user.findFirst({ where: { username } })

      if (find) return { error: 'Já existe um usuário com esse nome' }
    }

    // create
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/users')

  return { data: user }
}

export const createAction = safeAction(UserSchema, handler)
