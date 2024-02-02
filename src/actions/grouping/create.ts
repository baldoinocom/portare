'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Grouping } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { GroupingWithUniqueSchema } from './schema'

type InputType = z.infer<typeof GroupingWithUniqueSchema>
type ReturnType = ActionState<InputType, Grouping>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { driverId, truckId, semiTrailerId } = data

  let grouping

  try {
    const find = await db.grouping.findFirst({
      where: {
        driverId: emptyAsNull(driverId),
        truckId: emptyAsNull(truckId),
        semiTrailerId: emptyAsNull(semiTrailerId),
      },
    })

    if (find) {
      return { error: 'Já existe um agrupamento com esses dados' }
    }

    grouping = await db.grouping.create({
      data: { driverId, truckId, semiTrailerId },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/groupings')

  return { data: grouping }
}

export const createAction = safeAction(GroupingWithUniqueSchema, handler)
