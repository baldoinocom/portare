'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Unit } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UnitSchema } from './schema'

type InputType = z.infer<typeof UnitSchema>
type ReturnType = ActionState<InputType, Unit>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { company } = data

  let unit

  try {
    const { data, error } = await action.company().create(company)

    if (data) {
      unit = await db.unit.create({
        data: { company: { connect: { id: data.id } } },
        include: { company: true },
      })
    } else {
      return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/units')

  return { data: unit }
}

export const createAction = safeAction(UnitSchema, handler)
