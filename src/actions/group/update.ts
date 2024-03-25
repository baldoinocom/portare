'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Group } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { GroupUpdateSchema } from './schema'

type InputType = z.infer<typeof GroupUpdateSchema>
type ReturnType = ActionState<InputType, Group>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, name, roles } = data

  let group

  try {
    if (name) {
      const find = await db.group.findFirst({ where: { NOT: { id }, name } })

      if (find) {
        return { error: 'Já existe um grupo com esse nome' }
      }
    }

    group = await db.group.update({
      where: { id },
      data: {
        name,
        roles: roles
          ? { set: roles.filter(({ id }) => id) as { id: number }[] }
          : undefined,
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/system/groups/${id}`)
  revalidatePath('/system/groups')

  return { data: group }
}

export const updateAction = safeAction(GroupUpdateSchema, handler)
