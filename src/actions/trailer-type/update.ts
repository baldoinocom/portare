'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TrailerTypeUpdateSchema } from './schema'

type InputType = z.infer<typeof TrailerTypeUpdateSchema>
type ReturnType = ActionState<InputType, TrailerType>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, name } = data

  let trailerType

  try {
    if (name) {
      const find = await db.trailerType.findFirst({
        where: { NOT: { id }, name },
      })

      if (find) {
        return { error: 'Já existe um tipo de reboque com esse nome' }
      }
    }

    trailerType = await db.trailerType.update({ where: { id }, data: { name } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/trailer-types/${id}`)
  revalidatePath('/trailer-types')

  return { data: trailerType }
}

export const updateAction = safeAction(TrailerTypeUpdateSchema, handler)
