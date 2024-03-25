'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Group } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { GroupSchema } from './schema'

type InputType = z.infer<typeof GroupSchema>
type ReturnType = ActionState<InputType, Group>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, roles } = data

  let group

  try {
    const find = await db.group.findFirst({ where: { name } })

    if (find) {
      return { error: 'Já existe um grupo com esse nome' }
    }

    group = await db.group.create({
      data: { name, roles: roles ? { connect: roles } : undefined },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/system/groups')

  return { data: group }
}

export const createAction = safeAction(GroupSchema, handler)
