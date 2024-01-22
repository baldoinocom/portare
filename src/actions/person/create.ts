'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Person } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { PersonWithUniqueRelationshipSchema } from './schema'

type InputType = z.infer<typeof PersonWithUniqueRelationshipSchema>
type ReturnType = ActionState<InputType, Person>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, nickname, cpf, phoneNumber, unitId, aggregateId } = data

  let person

  try {
    if (cpf) {
      const find = await db.person.findFirst({ where: { cpf } })

      if (find) {
        return { error: 'Já existe uma pessoa com esse CPF' }
      }
    }

    person = await db.person.create({
      data: {
        name,
        nickname: emptyAsNull(nickname),
        cpf: emptyAsNull(cpf),
        phoneNumber: emptyAsNull(phoneNumber),
        unitId,
        aggregateId: unitId ? null : aggregateId,
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/people')

  return { data: person }
}

export const createAction = safeAction(
  PersonWithUniqueRelationshipSchema,
  handler,
)
