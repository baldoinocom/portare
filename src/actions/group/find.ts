'use server'

import { groupResource, GroupResource } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { GroupIdSchema } from './schema'

type InputType = z.infer<typeof GroupIdSchema>
type ReturnType = ActionState<InputType, GroupResource>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let group

  try {
    group = await db.group.findUniqueOrThrow({
      where: { id },
      include: groupResource.include,
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: group }
}

export const findAction = safeAction(GroupIdSchema, handler)
