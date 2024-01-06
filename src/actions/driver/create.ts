'use server'

import { action } from '@/actions'
import { DriverSchema } from '@/actions/driver/schema'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Driver } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

type InputType = z.infer<typeof DriverSchema>
type ReturnType = ActionState<InputType, Driver>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { person } = data

  let driver

  try {
    const { data, error } = await action.person().create(person)

    if (data) {
      driver = await db.driver.create({
        data: { person: { connect: { id: data.id } } },
        include: { person: true },
      })
    } else {
      return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/drivers')

  return { data: driver }
}

export const createAction = safeAction(DriverSchema, handler)
