'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TrailerTypeSchema } from './schema'

type InputType = z.infer<typeof TrailerTypeSchema>
type ReturnType = ActionState<InputType, TrailerType>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name } = data

  let trailerType

  try {
    const find = await db.trailerType.findFirst({ where: { name } })

    if (find) {
      return { error: 'Já existe um tipo de reboque com esse nome' }
    }

    trailerType = await db.trailerType.create({ data: { name } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/trailer-types')

  return { data: trailerType }
}

export const createAction = safeAction(TrailerTypeSchema, handler)
