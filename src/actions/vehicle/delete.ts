'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Vehicle } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { VehicleIdSchema } from './schema'

type InputType = z.infer<typeof VehicleIdSchema>
type ReturnType = ActionState<InputType, Vehicle>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let vehicle

  try {
    vehicle = await db.vehicle.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/vehicles')

  return { data: vehicle }
}

export const deleteAction = safeAction(VehicleIdSchema, handler)
