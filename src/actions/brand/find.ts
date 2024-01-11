'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Brand } from '@prisma/client'
import { z } from 'zod'
import { BrandIdSchema } from './schema'

type InputType = z.infer<typeof BrandIdSchema>
type ReturnType = ActionState<InputType, Brand>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let brand

  try {
    brand = await db.brand.findUniqueOrThrow({ where: { id } })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: brand }
}

export const findAction = safeAction(BrandIdSchema, handler)
