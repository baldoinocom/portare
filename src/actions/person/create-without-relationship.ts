'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Person } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { PersonWithoutRelationshipSchema } from './schema'

type InputType = z.infer<typeof PersonWithoutRelationshipSchema>
type ReturnType = ActionState<InputType, Person>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, nickname, cpf, phoneNumber } = data

  let person

  try {
    if (cpf) {
      const find = await db.person.findFirst({ where: { cpf } })

      if (find) {
        return { error: 'Já existe uma pessoa com esse CPF' }
      }
    }

    person = await db.person.create({
      data: { name, nickname, cpf, phoneNumber },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/people')

  return { data: person }
}

export const createWithoutRelationshipAction = safeAction(
  PersonWithoutRelationshipSchema,
  handler,
)
