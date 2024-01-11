'use server'

import { SemiTrailer } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { SemiTrailerIdSchema } from './schema'

type InputType = z.infer<typeof SemiTrailerIdSchema>
type ReturnType = ActionState<InputType, SemiTrailer>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let semiTrailer

  try {
    semiTrailer = await db.semiTrailer.findUniqueOrThrow({
      where: { id },
      include: {
        configuration: true,
        type: true,
        cargos: true,
        trailers: {
          include: { vehicle: { include: { brand: true, fleet: true } } },
        },
      },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: semiTrailer }
}

export const findAction = safeAction(SemiTrailerIdSchema, handler)
