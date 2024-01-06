'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Truck } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TruckSchema } from './schema'

type InputType = z.infer<typeof TruckSchema>
type ReturnType = ActionState<InputType, Truck>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { vehicle } = data

  let truck

  try {
    const { data, error } = await action.vehicle.create(vehicle)

    if (data) {
      truck = await db.truck.create({
        data: { vehicle: { connect: { id: data.id } } },
        include: {
          vehicle: { include: { brand: true, fleet: true, aggregate: true } },
        },
      })
    } else {
      return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/trucks')

  return { data: truck }
}

export const createAction = safeAction(TruckSchema, handler)
