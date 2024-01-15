'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Cargo } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { CargoIdSchema } from './schema'

type InputType = z.infer<typeof CargoIdSchema>
type ReturnType = ActionState<InputType, Cargo>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let cargo

  try {
    cargo = await db.brand.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/cargos')

  return { data: cargo }
}

export const deleteAction = safeAction(CargoIdSchema, handler)
