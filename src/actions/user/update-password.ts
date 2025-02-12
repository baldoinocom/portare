'use server'

import { ActionState, safeAction } from '@/lib/safe-action'
import clerk, { User } from '@clerk/clerk-sdk-node'
import { z } from 'zod'
import { UserUpdatePasswordSchema } from './schema'

type InputType = z.infer<typeof UserUpdatePasswordSchema>
type ReturnType = ActionState<InputType, User>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { externalUserId, currentPassword, newPassword, passwordConfirmation } =
    data

  let user

  try {
    if (newPassword !== passwordConfirmation) {
      return { error: 'As senhas não coincidem' }
    }

    const verifyPassword = await clerk.users
      .verifyPassword({ userId: externalUserId, password: currentPassword })
      .then(() => true)
      .catch(() => false)

    if (!verifyPassword) {
      return { error: 'A senha atual está incorreta' }
    } else if (currentPassword === newPassword) {
      return { error: 'A nova senha não pode ser igual a atual' }
    }

    user = await clerk.users.updateUser(externalUserId, {
      password: newPassword,
      skipPasswordChecks: true,
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  return { data: JSON.parse(JSON.stringify(user)) }
}

export const updatePasswordAction = safeAction(
  UserUpdatePasswordSchema,
  handler,
)
