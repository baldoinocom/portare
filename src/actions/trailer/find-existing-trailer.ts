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

  const chassisList = trailers
    .map(({ vehicle }) => vehicle.chassis)
    .filter((value) => value) as string[]

  const renavamList = trailers
    .map(({ vehicle }) => vehicle.renavam)
    .filter((value) => value) as string[]

  const fleetNumberList = trailers
    .map(({ fleetNumber }) => fleetNumber)
    .filter((value) => value) as string[]

  const find = await db.trailer.findMany({
    where: {
      NOT: { id },
      OR: [
        {
          vehicle: {
            OR: [
              { licensePlate: { in: licensePlateList } },
              { chassis: { in: chassisList } },
              { renavam: { in: renavamList } },
            ],
          },
        },
        { fleetNumber: { in: fleetNumberList } },
      ],
    },
    select: {
      vehicle: { select: { licensePlate: true, chassis: true, renavam: true } },
      fleetNumber: true,
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

  const repeatedChassis = findRepeatedStrings(
    find.map(({ vehicle: { renavam } }) => renavam),
  )

  if (repeatedChassis.length) {
    return {
      error: `Já existe um veículo com esse chassi (${repeatedChassis.join(
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

  const repeatedfleetNumber = findRepeatedStrings(
    find.map(({ fleetNumber }) => fleetNumber),
  )

  if (repeatedfleetNumber.length) {
    return {
      error: `Já existe um reboque com esse número de frota (${repeatedfleetNumber.join(
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
