'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { StoppedVehicle } from '@prisma/client'
import { z } from 'zod'
import { StoppedVehicleIdSchema } from './schema'

type InputType = z.infer<typeof StoppedVehicleIdSchema>
type ReturnType = ActionState<InputType, StoppedVehicle>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, vehicleId } = data

  let stoppedVehicle

  try {
    stoppedVehicle = await db.stoppedVehicle.findUniqueOrThrow({
      where: { id_vehicleId: { id, vehicleId } },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: stoppedVehicle }
}

export const findAction = safeAction(StoppedVehicleIdSchema, handler)
