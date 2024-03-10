'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { VehicleIdSchema } from './schema'

const arraySchema = z.array(VehicleIdSchema)

type InputType = z.infer<typeof arraySchema>
type ReturnType = ActionState<InputType, Prisma.BatchPayload>

const handler = async (data: InputType): Promise<ReturnType> => {
  let vehicles

  try {
    vehicles = await db.vehicle.deleteMany({
      where: { id: { in: data.map(({ id }) => id) } },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/vehicles')

  return { data: vehicles }
}

export const deleteManyAction = safeAction(arraySchema, handler)
