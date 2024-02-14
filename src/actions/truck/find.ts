'use server'

import { TruckResource, truckResource } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { TruckIdSchema } from './schema'

type InputType = z.infer<typeof TruckIdSchema>
type ReturnType = ActionState<InputType, TruckResource>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let truck

  try {
    truck = await db.truck.findUniqueOrThrow({
      where: { id },
      include: truckResource.include,
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: truck }
}

export const findAction = safeAction(TruckIdSchema, handler)
