'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { StoppedVehicle } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { StoppedVehicleWithDateRangeSchema } from './schema'

type InputType = z.infer<typeof StoppedVehicleWithDateRangeSchema>
type ReturnType = ActionState<InputType, StoppedVehicle>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { vehicleId, startedAt, endedAt, status, note } = data

  let stoppedVehicle

  try {
    stoppedVehicle = await db.stoppedVehicle.create({
      data: { vehicleId, startedAt, endedAt, status, note },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/stopped-vehicles')

  return { data: stoppedVehicle }
}

export const createAction = safeAction(
  StoppedVehicleWithDateRangeSchema,
  handler,
)
