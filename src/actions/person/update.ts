'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Person } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { PersonWithNullableRelationshipSchema } from './schema'

type InputType = z.infer<typeof PersonWithNullableRelationshipSchema>
type ReturnType = ActionState<InputType, Person>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, name, nickname, document, phoneNumber, unitId, aggregateId } =
    data

  let person

  try {
    if (document) {
      const find = await db.person.findFirst({
        where: { NOT: { id }, document },
      })

      if (find) {
        return { error: 'Já existe uma pessoa com esse CPF' }
      }
    }

    person = await db.person.update({
      where: { id },
      data: {
        name,
        nickname: emptyAsNull(nickname),
        document: emptyAsNull(document),
        phoneNumber: emptyAsNull(phoneNumber),
        unitId: aggregateId ? null : unitId,
        aggregateId: unitId ? null : aggregateId,
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/people/${id}`)
  revalidatePath('/people')

  return { data: person }
}

export const updateAction = safeAction(
  PersonWithNullableRelationshipSchema,
  handler,
)
