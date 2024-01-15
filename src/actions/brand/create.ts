'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Brand } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { BrandSchema } from './schema'

type InputType = z.infer<typeof BrandSchema>
type ReturnType = ActionState<InputType, Brand>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name } = data

  let brand

  try {
    const find = await db.brand.findFirst({ where: { name } })

    if (find) {
      return { error: 'Já existe uma marca com esse nome' }
    }

    brand = await db.brand.create({ data: { name } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/brands')

  return { data: brand }
}

export const createAction = safeAction(BrandSchema, handler)
