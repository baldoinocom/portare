'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Driver } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { DriverUpdateSchema } from './schema'

type InputType = z.infer<typeof DriverUpdateSchema>
type ReturnType = ActionState<InputType, Driver>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { personId, person } = data

  let driver

  try {
    const { data, error } = await action
      .person()
      .update({ id: personId, ...person })

    if (data) {
      driver = await db.driver.update({
        where: { personId },
        data: {},
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
