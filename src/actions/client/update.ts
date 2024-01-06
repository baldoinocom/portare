'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Client } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ClientUpdateSchema } from './schema'

type InputType = z.infer<typeof ClientUpdateSchema>
type ReturnType = ActionState<InputType, Client>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { companyId, company, type } = data

  let client

  try {
    const { error } = await action.company().update({
      id: companyId,
      ...company,
    })

    if (error) return { error }

    client = await db.client.update({
      where: { companyId },
      data: { type },
      include: { company: true },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/clients/${companyId}`)
  revalidatePath('/clients')

  return { data: client }
}

export const updateAction = safeAction(ClientUpdateSchema, handler)
