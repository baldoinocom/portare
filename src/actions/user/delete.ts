'use server'

import { ActionState, safeAction } from '@/lib/safe-action'
import clerk, { User } from '@clerk/clerk-sdk-node'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UserIdSchema } from './schema'

type InputType = z.infer<typeof UserIdSchema>
type ReturnType = ActionState<InputType, User>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { externalUserId } = data

  let user

  try {
    user = await clerk.users.deleteUser(externalUserId)
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/system/users')

  return { data: JSON.parse(JSON.stringify(user)) }
}

export const deleteAction = safeAction(UserIdSchema, handler)
