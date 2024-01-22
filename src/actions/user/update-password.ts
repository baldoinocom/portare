'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import clerk from '@clerk/clerk-sdk-node'
import { User } from '@prisma/client'
import { z } from 'zod'
import { UserPasswordFormSchema } from './schema'

type InputType = z.infer<typeof UserPasswordFormSchema>
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

    await clerk.users.updateUser(externalUserId, {
      password: newPassword,
      skipPasswordChecks: true,
    })

    user = await db.user.update({ where: { externalUserId }, data: {} })
  } catch (error) {
    console.log(error)
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  return { data: user }
}

export const updatePasswordAction = safeAction(UserPasswordFormSchema, handler)
