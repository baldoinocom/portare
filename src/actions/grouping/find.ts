'use server'

import { GroupingInclude } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { GroupingIdSchema } from './schema'

type InputType = z.infer<typeof GroupingIdSchema>
type ReturnType = ActionState<InputType, GroupingInclude>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let grouping

  try {
    grouping = await db.grouping.findUniqueOrThrow({
      where: { id },
      include: {
        driver: { include: { person: true } },
        truck: { include: { vehicle: { include: { brand: true } } } },
        semiTrailer: {
          include: {
            type: true,
            cargos: true,
            configuration: true,
            trailers: { include: { vehicle: { include: { brand: true } } } },
          },
        },
      },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: grouping }
}

export const findAction = safeAction(GroupingIdSchema, handler)
