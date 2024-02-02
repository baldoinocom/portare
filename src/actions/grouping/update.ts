'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Grouping } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { GroupingUpdateSchema } from './schema'

type InputType = z.infer<typeof GroupingUpdateSchema>
type ReturnType = ActionState<InputType, Grouping>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, driverId, truckId, semiTrailerId } = data

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

    grouping = await db.grouping.update({
      where: { id },
      data: { driverId, truckId, semiTrailerId },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/groupings/${id}`)
  revalidatePath('/groupings')

  return { data: grouping }
}

export const updateAction = safeAction(GroupingUpdateSchema, handler)
