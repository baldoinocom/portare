'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { User } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UserUpdateSchema } from './schema'

type InputType = z.infer<typeof UserUpdateSchema>
type ReturnType = ActionState<InputType, User>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, username } = data

  let user

  try {
    if (username) {
      const find = await db.user.findFirst({ where: { NOT: { id }, username } })

      if (find) return { error: 'Já existe um usuário com esse nome' }
    }

    // update
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/users/${id}`)
  revalidatePath('/user')

  return { data: user }
}

export const updateAction = safeAction(UserUpdateSchema, handler)
