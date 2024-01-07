'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Aggregate } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AggregateWithNullableDocumentSchema } from './schema'

type InputType = z.infer<typeof AggregateWithNullableDocumentSchema>
type ReturnType = ActionState<InputType, Aggregate>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, person, company, fleetId } = data

  let aggregate

  try {
    const find = await db.aggregate.findUnique({
      where: { id },
      select: { personId: true, companyId: true },
    })

    if (person) {
      if (find?.personId) {
        const { error } = await action
          .person()
          .update({ id: find.personId, ...person })

        if (error) return { error }
      } else {
        const { error, fieldErrors } = await action
          .aggregate()
          .updateDocument(data)

        if (error || fieldErrors) return error ? { error } : { fieldErrors }
      }

      aggregate = await db.aggregate.update({
        where: { id },
        data: { fleet: { update: { companyId: fleetId } } },
        include: { person: true },
      })
    } else if (company) {
      if (find?.companyId) {
        const { error } = await action
          .company()
          .update({ id: find.companyId, ...company })

        if (error) return { error }
      } else {
        const { error, fieldErrors } = await action
          .aggregate()
          .updateDocument(data)

        if (error || fieldErrors) return error ? { error } : { fieldErrors }
      }

      aggregate = await db.aggregate.update({
        where: { id },
        data: { fleet: { update: { companyId: fleetId } } },
        include: { company: true },
      })
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/aggregates/${id}`)
  revalidatePath('/aggregates')

  return { data: aggregate }
}

export const updateAction = safeAction(
  AggregateWithNullableDocumentSchema,
  handler,
)
