'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Truck } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TruckIdSchema } from './schema'

type InputType = z.infer<typeof TruckIdSchema>
type ReturnType = ActionState<InputType, Truck>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let truck

  try {
    truck = await db.truck.delete({ where: { id } })

    if (truck) {
      const { error } = await action.vehicle().delete({ id: truck.vehicleId })

      if (error) return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/trucks')

  return { data: truck }
}

export const deleteAction = safeAction(TruckIdSchema, handler)
