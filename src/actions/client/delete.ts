'use server'

import { ClientIdSchema } from '@/actions/client/schema'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Client } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type InputType = z.infer<typeof ClientIdSchema>
type ReturnType = ActionState<InputType, Client>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { companyId } = data

  let client

  try {
    client = await db.client.delete({ where: { companyId } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/clients')

  return { data: client }
}

export const deleteAction = safeAction(ClientIdSchema, handler)
