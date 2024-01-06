'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Fleet } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { FleetIdSchema } from './schema'

type InputType = z.infer<typeof FleetIdSchema>
type ReturnType = ActionState<InputType, Fleet>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { companyId } = data

  let fleet

  try {
    fleet = await db.fleet.delete({ where: { companyId } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/fleets')

  return { data: fleet }
}

export const deleteAction = safeAction(FleetIdSchema, handler)
