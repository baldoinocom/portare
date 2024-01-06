'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Truck } from '@prisma/client'
import { z } from 'zod'
import { TruckIdSchema } from './schema'

type InputType = z.infer<typeof TruckIdSchema>
type ReturnType = ActionState<InputType, Truck>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let truck

  try {
    truck = await db.truck.findUniqueOrThrow({
      where: { id },
      include: {
        vehicle: { include: { brand: true, fleet: true, aggregate: true } },
      },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: truck }
}

export const findAction = safeAction(TruckIdSchema, handler)
