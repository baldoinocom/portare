'use server'

import { AggregateInclude } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { AggregateIdSchema } from './schema'

type InputType = z.infer<typeof AggregateIdSchema>
type ReturnType = ActionState<InputType, AggregateInclude>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let aggregate

  try {
    aggregate = await db.aggregate.findUniqueOrThrow({
      where: { id },
      include: { company: true, person: true, unit: true },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: aggregate }
}

export const findAction = safeAction(AggregateIdSchema, handler)
