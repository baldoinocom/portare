'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Aggregate } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AggregateSchema } from './schema'

type InputType = z.infer<typeof AggregateSchema>
type ReturnType = ActionState<InputType, Aggregate>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { company, unitId } = data

  let aggregate

  try {
    const { data, error } = await action.company().create(company)

    if (data) {
      aggregate = await db.aggregate.create({
        data: {
          company: { connect: { id: data.id } },
          unit: { connect: { companyId: unitId } },
        },
        include: { company: { include: { address: true } } },
      })
    } else {
      return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/aggregates')

  return { data: aggregate }
}

export const createAction = safeAction(AggregateSchema, handler)
