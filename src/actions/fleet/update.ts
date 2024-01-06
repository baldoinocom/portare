'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Fleet } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { FleetUpdateSchema } from './schema'

type InputType = z.infer<typeof FleetUpdateSchema>
type ReturnType = ActionState<InputType, Fleet>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { companyId, company } = data

  let fleet

  try {
    const { data, error } = await action.company.update({
      id: companyId,
      ...company,
    })

    if (data) {
      fleet = await db.fleet.update({
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

  revalidatePath(`/fleets/${companyId}`)
  revalidatePath('/fleets')

  return { data: fleet }
}

export const updateAction = safeAction(FleetUpdateSchema, handler)
