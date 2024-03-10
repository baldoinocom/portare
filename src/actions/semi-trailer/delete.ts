'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { SemiTrailer } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { SemiTrailerIdSchema } from './schema'

type InputType = z.infer<typeof SemiTrailerIdSchema>
type ReturnType = ActionState<InputType, SemiTrailer>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let semiTrailer

  try {
    semiTrailer = await db.semiTrailer.delete({
      where: { id },
      include: { trailers: true },
    })

    if (semiTrailer) {
      const { error } = await action
        .vehicle()
        .deleteMany(
          semiTrailer.trailers.map(({ vehicleId }) => ({ id: vehicleId })),
        )

      if (error) return { error }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/semi-trailers')

  return { data: semiTrailer }
}

export const deleteAction = safeAction(SemiTrailerIdSchema, handler)
