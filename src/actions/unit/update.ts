'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Unit } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UnitUpdateSchema } from './schema'

type InputType = z.infer<typeof UnitUpdateSchema>
type ReturnType = ActionState<InputType, Unit>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { companyId, company } = data

  let unit

  try {
    const { data, error } = await action
      .company()
      .update({ id: companyId, ...company })

    if (data) {
      unit = await db.unit.update({
        where: { companyId },
        data: {},
        include: { company: true },
      })
    } else {
      return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/units/${companyId}`)
  revalidatePath('/units')

  return { data: unit }
}

export const updateAction = safeAction(UnitUpdateSchema, handler)
