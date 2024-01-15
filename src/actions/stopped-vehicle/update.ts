'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { StoppedVehicle } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { StoppedVehicleUpdateSchema } from './schema'

type InputType = z.infer<typeof StoppedVehicleUpdateSchema>
type ReturnType = ActionState<InputType, StoppedVehicle>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, vehicleId, startedAt, expirationType, status, note } = data

  let stoppedVehicle

  try {
    stoppedVehicle = await db.stoppedVehicle.update({
      where: { id_vehicleId: { id, vehicleId } },
      data: { startedAt, expirationType, status, note },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/stopped-vehicles/${id}`)
  revalidatePath('/stopped-vehicles')

  return { data: stoppedVehicle }
}

export const updateAction = safeAction(StoppedVehicleUpdateSchema, handler)
