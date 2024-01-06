'use server'

import { Fleet } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { FleetIdSchema } from './schema'

type InputType = z.infer<typeof FleetIdSchema>
type ReturnType = ActionState<InputType, Fleet>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { companyId } = data

  let fleet

  try {
    fleet = await db.fleet.findUniqueOrThrow({
      where: { companyId },
      include: { company: true },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: fleet }
}

export const findAction = safeAction(FleetIdSchema, handler)
