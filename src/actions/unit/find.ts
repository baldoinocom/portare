'use server'

import { UnitInclude } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { UnitIdSchema } from './schema'

type InputType = z.infer<typeof UnitIdSchema>
type ReturnType = ActionState<InputType, UnitInclude>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { companyId } = data

  let unit

  try {
    unit = await db.unit.findUniqueOrThrow({
      where: { companyId },
      include: { company: true },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: unit }
}

export const findAction = safeAction(UnitIdSchema, handler)
