'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Driver } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { DriverUpdateSchema } from './schema'

type InputType = z.infer<typeof DriverUpdateSchema>
type ReturnType = ActionState<InputType, Driver>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { personId, person, cnh } = data

  let driver

  try {
    if (cnh) {
      const find = await db.driver.findFirst({
        where: { NOT: { personId }, cnh },
      })

      if (find) {
        return { error: 'Já existe um motorista com essa CNH' }
      }
    }

    const { data, error } = await action
      .person()
      .update({ id: personId, ...person })

    if (data) {
      driver = await db.driver.update({
        where: { personId },
        data: { cnh: emptyAsNull(cnh) },
        include: { person: true },
      })
    } else {
      return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/drivers/${personId}`)
  revalidatePath('/drivers')

  return { data: driver }
}

export const updateAction = safeAction(DriverUpdateSchema, handler)
