'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Vehicle } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { VehicleWithNullableRelationshipSchema } from './schema'

type InputType = z.infer<typeof VehicleWithNullableRelationshipSchema>
type ReturnType = ActionState<InputType, Vehicle>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, licensePlate, model, renavam, brandId, fleetId, aggregateId } =
    data

  let vehicle

  try {
    if (licensePlate) {
      const find = await db.vehicle.findFirst({
        where: { NOT: { id }, licensePlate },
      })

      if (find) {
        return { error: 'Já existe um veículo com essa placa' }
      }
    } else if (renavam) {
      const find = await db.vehicle.findFirst({
        where: { NOT: { id }, renavam },
      })

      if (find) {
        return { error: 'Já existe um veículo com esse RENAVAM' }
      }
    }

    vehicle = await db.vehicle.update({
      where: { id },
      data: {
        licensePlate,
        model,
        renavam,
        brandId,
        fleetId,
        aggregateId: fleetId ? null : aggregateId,
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/vehicles/${id}`)
  revalidatePath('/vehicles')

  return { data: vehicle }
}

export const updateAction = safeAction(
  VehicleWithNullableRelationshipSchema,
  handler,
)
