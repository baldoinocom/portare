'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Person } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { PersonIdSchema } from './schema'

type InputType = z.infer<typeof PersonIdSchema>
type ReturnType = ActionState<InputType, Person>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let person

  try {
    person = await db.person.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/people')

  return { data: person }
}

export const deleteAction = safeAction(PersonIdSchema, handler)
