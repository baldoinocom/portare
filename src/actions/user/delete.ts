'use server'

import { ActionState, safeAction } from '@/lib/safe-action'
import { User } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UserIdSchema } from './schema'

type InputType = z.infer<typeof UserIdSchema>
type ReturnType = ActionState<InputType, User>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let user

  try {
    // delete
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/users')

  return { data: user }
}

export const deleteAction = safeAction(UserIdSchema, handler)
