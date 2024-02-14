'use server'

import { GroupingResource, groupingResource } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { GroupingIdSchema } from './schema'

type InputType = z.infer<typeof GroupingIdSchema>
type ReturnType = ActionState<InputType, GroupingResource>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let grouping

  try {
    grouping = await db.grouping.findUniqueOrThrow({
      where: { id },
      include: groupingResource.include,
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: grouping }
}

export const findAction = safeAction(GroupingIdSchema, handler)
