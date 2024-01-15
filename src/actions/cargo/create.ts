'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Cargo } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { CargoSchema } from './schema'

type InputType = z.infer<typeof CargoSchema>
type ReturnType = ActionState<InputType, Cargo>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name } = data

  let cargo

  try {
    const find = await db.cargo.findFirst({ where: { name } })

    if (find) {
      return { error: 'Já existe uma carga com esse nome' }
    }

    cargo = await db.cargo.create({ data: { name } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/cargos')

  return { data: cargo }
}

export const createAction = safeAction(CargoSchema, handler)
