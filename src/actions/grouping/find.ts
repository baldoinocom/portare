'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Grouping } from '@prisma/client'
import { z } from 'zod'
import { GroupingIdSchema } from './schema'

type InputType = z.infer<typeof GroupingIdSchema>
type ReturnType = ActionState<InputType, Grouping>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let grouping

  try {
    grouping = await db.grouping.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: grouping }
}

export const findAction = safeAction(GroupingIdSchema, handler)
