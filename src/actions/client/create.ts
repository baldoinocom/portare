'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Client } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ClientSchema } from './schema'

type InputType = z.infer<typeof ClientSchema>
type ReturnType = ActionState<InputType, Client>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { company, type } = data

  let client

  try {
    const { data, error } = await action.company.create(company)

    if (data) {
      client = await db.client.create({
        data: {
          company: { connect: { id: data.id } },
          type,
        },
        include: { company: true },
      })
    } else {
      return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/clients')

  return { data: client }
}

export const createAction = safeAction(ClientSchema, handler)
