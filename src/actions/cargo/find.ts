'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Cargo } from '@prisma/client'
import { z } from 'zod'
import { CargoIdSchema } from './schema'

type InputType = z.infer<typeof CargoIdSchema>
type ReturnType = ActionState<InputType, Cargo>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let cargo

  try {
    cargo = await db.cargo.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: cargo }
}

export const findAction = safeAction(CargoIdSchema, handler)
