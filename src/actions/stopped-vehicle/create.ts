'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { StoppedVehicle } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { StoppedVehicleSchema } from './schema'

type InputType = z.infer<typeof StoppedVehicleSchema>
type ReturnType = ActionState<InputType, StoppedVehicle>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { vehicleId, startedAt, expirationType, status, note } = data

  let stoppedVehicle

  try {
    stoppedVehicle = await db.stoppedVehicle.create({
      data: { vehicleId, startedAt, expirationType, status, note },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/stopped-vehicles')

  return { data: stoppedVehicle }
}

export const createAction = safeAction(StoppedVehicleSchema, handler)
