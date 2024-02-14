'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Aggregate } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AggregateUpdateSchema } from './schema'

type InputType = z.infer<typeof AggregateUpdateSchema>
type ReturnType = ActionState<InputType, Aggregate>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { companyId, company, unitId } = data

  let aggregate

  try {
    const { error } = await action
      .company()
      .update({ id: companyId, ...company })

    if (error) return { error }

    aggregate = await db.aggregate.update({
      where: { companyId },
      data: { unit: { update: { companyId: unitId } } },
      include: { company: { include: { address: true } } },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/aggregates/${companyId}`)
  revalidatePath('/aggregates')

  return { data: aggregate }
}

export const updateAction = safeAction(AggregateUpdateSchema, handler)
