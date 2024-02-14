'use server'

import { SemiTrailerResource, semiTrailerResource } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { SemiTrailerIdSchema } from './schema'

type InputType = z.infer<typeof SemiTrailerIdSchema>
type ReturnType = ActionState<InputType, SemiTrailerResource>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let semiTrailer

  try {
    semiTrailer = await db.semiTrailer.findUniqueOrThrow({
      where: { id },
      include: semiTrailerResource.include,
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: semiTrailer }
}

export const findAction = safeAction(SemiTrailerIdSchema, handler)
