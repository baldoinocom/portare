'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Brand } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { BrandUpdateSchema } from './schema'

type InputType = z.infer<typeof BrandUpdateSchema>
type ReturnType = ActionState<InputType, Brand>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, name } = data

  let brand

  try {
    if (name) {
      const find = await db.brand.findFirst({ where: { NOT: { id }, name } })

      if (find) {
        return { error: 'Já existe uma marca com esse nome' }
      }
    }

    brand = await db.brand.update({ where: { id }, data: { name } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/brands/${id}`)
  revalidatePath('/brands')

  return { data: brand }
}

export const updateAction = safeAction(BrandUpdateSchema, handler)
