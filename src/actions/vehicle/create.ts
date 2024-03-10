'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Vehicle } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { VehicleWithUniqueRelationshipSchema } from './schema'

type InputType = z.infer<typeof VehicleWithUniqueRelationshipSchema>
type ReturnType = ActionState<InputType, Vehicle>

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    licensePlate,
    model,
    year,
    axle,
    chassis,
    renavam,
    brandId,
    unitId,
    aggregateId,
  } = data

  let vehicle

  try {
    if (licensePlate) {
      const find = await db.vehicle.findFirst({ where: { licensePlate } })

      if (find) return { error: 'Já existe um veículo com essa placa' }
    }

    if (chassis) {
      const find = await db.vehicle.findFirst({ where: { chassis } })

      if (find) return { error: 'Já existe um veículo com esse chassi' }
    }

    if (renavam) {
      const find = await db.vehicle.findFirst({ where: { renavam } })

      if (find) return { error: 'Já existe um veículo com esse RENAVAM' }
    }

    vehicle = await db.vehicle.create({
      data: {
        licensePlate,
        model: emptyAsNull(model),
        year: emptyAsNull(year),
        axle: axle === 0 ? null : axle,
        chassis: emptyAsNull(chassis),
        renavam: emptyAsNull(renavam),
        brandId,
        unitId,
        aggregateId: unitId ? null : aggregateId,
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/vehicles')

  return { data: vehicle }
}

export const createAction = safeAction(
  VehicleWithUniqueRelationshipSchema,
  handler,
)
