'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { findRepeatedStrings } from '@/lib/utils'
import { z } from 'zod'
import { TrailerExistingSchema, TrailerSchema } from './schema'

type InputType = z.infer<typeof TrailerExistingSchema>
type OutputType = z.infer<typeof TrailerSchema>[]
type ReturnType = ActionState<InputType, OutputType>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, trailers } = data

  const licensePlateList = trailers
    .map(({ vehicle }) => vehicle.licensePlate)
    .filter((value) => value) as string[]

  const renavamList = trailers
    .map(({ vehicle }) => vehicle.renavam)
    .filter((value) => value) as string[]

  const unitNumberList = trailers
    .map(({ unitNumber }) => unitNumber)
    .filter((value) => value) as string[]

  const find = await db.trailer.findMany({
    where: {
      NOT: { id },
      OR: [
        { unitNumber: { in: unitNumberList } },
        {
          vehicle: {
            OR: [
              { licensePlate: { in: licensePlateList } },
              { renavam: { in: renavamList } },
            ],
          },
        },
      ],
    },
    select: {
      unitNumber: true,
      vehicle: { select: { licensePlate: true, renavam: true } },
    },
  })

  const repeatedLicensePlate = findRepeatedStrings(
    find.map(({ vehicle: { licensePlate } }) => licensePlate),
  )

  if (repeatedLicensePlate.length) {
    return {
      error: `Já existe um veículo com essa placa (${repeatedLicensePlate.join(
        ', ',
      )})`,
    }
  }

  const repeatedRenavam = findRepeatedStrings(
    find.map(({ vehicle: { renavam } }) => renavam),
  )

  if (repeatedRenavam.length) {
    return {
      error: `Já existe um veículo com esse RENAVAM (${repeatedRenavam.join(
        ', ',
      )})`,
    }
  }

  const repeatedUnitNumber = findRepeatedStrings(
    find.map(({ unitNumber }) => unitNumber),
  )

  if (repeatedUnitNumber.length) {
    return {
      error: `Já existe um reboque com esse número de unidade (${repeatedUnitNumber.join(
        ', ',
      )})`,
    }
  }

  return { data: trailers }
}

export const findExistingTrailerAction = safeAction(
  TrailerExistingSchema,
  handler,
)
