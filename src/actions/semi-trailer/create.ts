'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { SemiTrailer } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { SemiTrailerSchema } from './schema'

type InputType = z.infer<typeof SemiTrailerSchema>
type ReturnType = ActionState<InputType, SemiTrailer>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { model, brandId, fleetId, configurationId, typeId, cargos, trailers } =
    data

  let semiTrailer

  try {
    const { error } = await action.trailer().findExistingTrailer({ trailers })

    if (error) return { error }

    const find = await db.trailerConfiguration.findUnique({
      where: { id: configurationId },
      select: { numberOfTrailers: true },
    })

    if (find?.numberOfTrailers !== trailers.length) {
      return {
        error: 'O número de reboques não corresponde à configuração definida',
      }
    }

    const trailerIds = await db.$transaction(
      trailers.map(({ vehicle, fleetNumber }) =>
        db.trailer.create({
          data: {
            fleetNumber: fleetNumber || null,
            vehicle: {
              create: {
                model,
                licensePlate: vehicle.licensePlate,
                renavam: vehicle.renavam || null,
                brand: { connect: { id: brandId } },
                fleet: { connect: { companyId: fleetId } },
              },
            },
          },
          select: { id: true },
        }),
      ),
    )

    semiTrailer = await db.semiTrailer.create({
      data: {
        configuration: { connect: { id: configurationId } },
        type: { connect: { id: typeId } },
        cargos: { connect: cargos },
        trailers: { connect: trailerIds.map(({ id }) => ({ id })) },
      },
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
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/semi-trailers')

  return { data: semiTrailer }
}

export const createAction = safeAction(SemiTrailerSchema, handler)
