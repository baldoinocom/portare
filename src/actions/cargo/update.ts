'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Cargo } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { CargoUpdateSchema } from './schema'

type InputType = z.infer<typeof CargoUpdateSchema>
type ReturnType = ActionState<InputType, Cargo>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, name } = data

  let cargo

  try {
    if (name) {
      const find = await db.cargo.findFirst({ where: { NOT: { id }, name } })

      if (find) {
        return { error: 'Já existe uma carga com esse nome' }
      }
    }

    cargo = await db.cargo.update({ where: { id }, data: { name } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/cargos/${id}`)
  revalidatePath('/cargos')

  return { data: cargo }
}

export const updateAction = safeAction(CargoUpdateSchema, handler)
