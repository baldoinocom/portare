'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { User } from '@prisma/client'
import { z } from 'zod'
import { UserIdSchema } from './schema'

type InputType = z.infer<typeof UserIdSchema>
type ReturnType = ActionState<InputType, User>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { externalUserId } = data

  let user

  try {
    user = await db.user.findUniqueOrThrow({ where: { externalUserId } })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: user }
}

export const findAction = safeAction(UserIdSchema, handler)
