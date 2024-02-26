'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Truck } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TruckUpdateSchema } from './schema'

type InputType = z.infer<typeof TruckUpdateSchema>
type ReturnType = ActionState<InputType, Truck>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, vehicle, compressor, compressorModel } = data

  let truck

  try {
    const { data, error } = await action.vehicle().update({ id, ...vehicle })

    if (data) {
      truck = await db.truck.update({
        where: { id },
        data: {
          compressor,
          compressorModel:
            compressor === false ? null : emptyAsNull(compressorModel),
        },
        include: {
          vehicle: { include: { brand: true, unit: true, aggregate: true } },
        },
      })
    } else {
      return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/trucks/${id}`)
  revalidatePath('/trucks')

  return { data: truck }
}

export const updateAction = safeAction(TruckUpdateSchema, handler)
