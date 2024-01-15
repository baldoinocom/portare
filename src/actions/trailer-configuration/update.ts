'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerConfiguration } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TrailerConfigurationUpdateSchema } from './schema'

type InputType = z.infer<typeof TrailerConfigurationUpdateSchema>
type ReturnType = ActionState<InputType, TrailerConfiguration>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, name, numberOfTrailers } = data

  let trailerConfiguration

  try {
    if (name) {
      const find = await db.trailerConfiguration.findFirst({
        where: { NOT: { id }, name },
      })

      if (find) {
        return { error: 'Já existe uma configuração de reboque com esse nome' }
      }
    }

    trailerConfiguration = await db.trailerConfiguration.update({
      where: { id },
      data: { name, numberOfTrailers },
    })

    const semiTrailers = await db.semiTrailer.findMany({
      where: { configurationId: Number(id) },
      include: { trailers: true },
    })

    if (semiTrailers) {
      for (const semiTrailer of semiTrailers) {
        const deleteTrailers = semiTrailer.trailers.slice(numberOfTrailers)

        await db.$transaction(
          deleteTrailers.map(({ vehicleId }) =>
            db.vehicle.delete({ where: { id: vehicleId } }),
          ),
        )
      }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/trailer-configurations/${id}`)
  revalidatePath('/trailer-configurations')

  return { data: trailerConfiguration }
}

export const updateAction = safeAction(
  TrailerConfigurationUpdateSchema,
  handler,
)
