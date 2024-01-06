'use server'

import { Client } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { ClientIdSchema } from './schema'

type InputType = z.infer<typeof ClientIdSchema>
type ReturnType = ActionState<InputType, Client>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { companyId } = data

  let client

  try {
    client = await db.client.findUniqueOrThrow({
      where: { companyId },
      include: { company: true },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: client }
}

export const findAction = safeAction(ClientIdSchema, handler)
