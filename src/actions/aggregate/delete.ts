'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Aggregate } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AggregateIdSchema } from './schema'

type InputType = z.infer<typeof AggregateIdSchema>
type ReturnType = ActionState<InputType, Aggregate>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let aggregate

  try {
    aggregate = await db.aggregate.findUnique({
      where: { id },
      select: {
        personId: true,
        companyId: true,
        person: { include: { driver: { select: { personId: true } } } },
      },
    })

    if (aggregate?.personId && !aggregate?.person?.driver) {
      await action.person.delete({ id: aggregate.personId })
    } else if (aggregate?.companyId) {
      await action.company.delete({ id: aggregate.companyId })
    }

    aggregate = await db.aggregate.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/aggregates')

  return { data: aggregate }
}

export const deleteAction = safeAction(AggregateIdSchema, handler)
