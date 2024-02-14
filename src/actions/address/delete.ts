'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Address } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AddressIdSchema } from './schema'

type InputType = z.infer<typeof AddressIdSchema>
type ReturnType = ActionState<InputType, Address>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let address

  try {
    address = await db.address.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/addresses')

  return { data: address }
}

export const deleteAction = safeAction(AddressIdSchema, handler)
