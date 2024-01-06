'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Aggregate } from '@prisma/client'
import { z } from 'zod'
import {
  AggregateWithNullableDocumentSchema,
  AggregateWithUniqueDocumentSchema,
} from './schema'

type InputType = z.infer<typeof AggregateWithNullableDocumentSchema>
type ReturnType = ActionState<InputType, Aggregate>

const handler = async (data: InputType): Promise<ReturnType> => {
  let aggregate

  const changeAggregate = AggregateWithUniqueDocumentSchema.safeParse(data)

  if (changeAggregate.success) {
    const changeData = AggregateWithUniqueDocumentSchema.parse(data)

    if (changeData.person) {
      const { data: createdPerson, error } =
        await action.person.createWithoutRelationship(changeData.person)

      if (createdPerson) {
        aggregate = await db.aggregate.update({
          where: { id: data.id },
          data: {
            person: { connect: { id: createdPerson?.id } },
            company: { disconnect: true },
          },
        })
      } else {
        return { error }
      }

      if (aggregate.companyId) {
        await action.company.delete({ id: aggregate.companyId })
      }
    } else if (changeData.company) {
      const { data: createdCompany, error } = await action.company.create(
        changeData.company,
      )

      if (createdCompany) {
        aggregate = await db.aggregate.update({
          where: { id: data.id },
          data: {
            company: { connect: { id: createdCompany?.id } },
            person: { disconnect: true },
          },
          include: {
            person: { select: { driver: { select: { personId: true } } } },
          },
        })
      } else {
        return { error }
      }

      if (aggregate.personId && !aggregate.person?.driver) {
        await action.person.delete({ id: aggregate.personId })
      }
    }

    return { data: aggregate }
  } else {
    return { fieldErrors: changeAggregate.error.flatten().fieldErrors }
  }
}

export const updateDocumentAction = safeAction(
  AggregateWithNullableDocumentSchema,
  handler,
)
