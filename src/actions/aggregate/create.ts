'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Aggregate } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AggregateWithUniqueDocumentSchema } from './schema'

type InputType = z.infer<typeof AggregateWithUniqueDocumentSchema>
type ReturnType = ActionState<InputType, Aggregate>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { person, company, unitId } = data

  let aggregate

  try {
    if (person) {
      const { data, error } = await action
        .person()
        .createWithoutRelationship(person)

      if (data) {
        aggregate = await db.aggregate.create({
          data: {
            person: { connect: { id: data.id } },
            unit: { connect: { companyId: unitId } },
          },
          include: { person: true, unit: true },
        })
      } else {
        return { error }
      }
    } else if (company) {
      const { data, error } = await action.company().create(company)

      if (data) {
        aggregate = await db.aggregate.create({
          data: {
            company: { connect: { id: data.id } },
            unit: { connect: { companyId: unitId } },
          },
          include: { company: true, unit: true },
        })
      } else {
        return { error }
      }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/aggregates')

  return { data: aggregate }
}

export const createAction = safeAction(
  AggregateWithUniqueDocumentSchema,
  handler,
)
