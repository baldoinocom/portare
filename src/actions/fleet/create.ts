'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Fleet } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { FleetSchema } from './schema'

type InputType = z.infer<typeof FleetSchema>
type ReturnType = ActionState<InputType, Fleet>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { company } = data

  let fleet

  try {
    const { data, error } = await action.company.create(company)

    if (data) {
      fleet = await db.fleet.create({
        data: { company: { connect: { id: data.id } } },
        include: { company: true },
      })
    } else {
      return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/fleets')

  return { data: fleet }
}

export const createAction = safeAction(FleetSchema, handler)
