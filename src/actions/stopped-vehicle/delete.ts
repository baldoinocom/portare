'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { StoppedVehicle } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { StoppedVehicleIdSchema } from './schema'

type InputType = z.infer<typeof StoppedVehicleIdSchema>
type ReturnType = ActionState<InputType, StoppedVehicle>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, vehicleId } = data

  let stoppedVehicle

  try {
    stoppedVehicle = await db.stoppedVehicle.delete({
      where: { id_vehicleId: { id, vehicleId } },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/stopped-vehicles')

  return { data: stoppedVehicle }
}

export const deleteAction = safeAction(StoppedVehicleIdSchema, handler)
