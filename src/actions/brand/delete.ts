'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Brand } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { BrandIdSchema } from './schema'

type InputType = z.infer<typeof BrandIdSchema>
type ReturnType = ActionState<InputType, Brand>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let brand

  try {
    brand = await db.brand.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/brands')

  return { data: brand }
}

export const deleteAction = safeAction(BrandIdSchema, handler)
