'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerConfiguration } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TrailerConfigurationSchema } from './schema'

type InputType = z.infer<typeof TrailerConfigurationSchema>
type ReturnType = ActionState<InputType, TrailerConfiguration>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, numberOfTrailers } = data

  let trailerConfiguration

  try {
    const find = await db.trailerConfiguration.findFirst({ where: { name } })

    if (find) {
      return { error: 'Já existe uma configuração de reboque com esse nome' }
    }

    trailerConfiguration = await db.trailerConfiguration.create({
      data: { name, numberOfTrailers },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/trailer-configurations')

  return { data: trailerConfiguration }
}

export const createAction = safeAction(TrailerConfigurationSchema, handler)
