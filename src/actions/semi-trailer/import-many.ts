'use server'

import { BrandSchema } from '@/actions/brand/schema'
import { CargoSchema } from '@/actions/cargo/schema'
import { TrailerConfigurationSchema } from '@/actions/trailer-configuration/schema'
import { TrailerTypeSchema } from '@/actions/trailer-type/schema'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { SemiTrailer } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { SemiTrailerImportSchema, SemiTrailerSchema } from './schema'

const arraySchema = z.array(SemiTrailerImportSchema)

type InputType = z.infer<typeof arraySchema>
type ReturnType = ActionState<InputType, SemiTrailer[]>

const handler = async (data: InputType): Promise<ReturnType> => {
  let semiTrailers

  try {
    const semiTrailersSchema = z.array(
      z
        .object({
          brand: BrandSchema,
          type: TrailerTypeSchema,
          cargos: z.array(CargoSchema),
          configuration: TrailerConfigurationSchema,
        })
        .and(SemiTrailerSchema),
    )

    const parsedData = semiTrailersSchema.parse(
      data.map((semiTrailer) => {
        const trailers = []

        if (semiTrailer.Placa) {
          trailers.push({
            vehicle: {
              licensePlate: semiTrailer.Placa,
              chassis: semiTrailer.Chassi,
              renavam: semiTrailer.Renavam,
            },
            fleetNumber: semiTrailer['Nº de frota'],
          })
        }

        if (semiTrailer['2-Placa']) {
          trailers.push({
            vehicle: {
              licensePlate: semiTrailer['2-Placa'],
              chassis: semiTrailer['2-Chassi'],
              renavam: semiTrailer['2-Renavam'],
            },
            fleetNumber: semiTrailer['2-Nº de frota'],
          })
        }

        if (semiTrailer['3-Placa']) {
          trailers.push({
            vehicle: {
              licensePlate: semiTrailer['3-Placa'],
              chassis: semiTrailer['3-Chassi'],
              renavam: semiTrailer['3-Renavam'],
            },
            fleetNumber: semiTrailer['3-Nº de frota'],
          })
        }

        if (semiTrailer['4-Placa']) {
          trailers.push({
            vehicle: {
              licensePlate: semiTrailer['4-Placa'],
              chassis: semiTrailer['4-Chassi'],
              renavam: semiTrailer['4-Renavam'],
            },
            fleetNumber: semiTrailer['4-Nº de frota'],
          })
        }

        return {
          unitId: Number(semiTrailer.Unidade),

          brand: { name: semiTrailer.Marca },
          model: semiTrailer.Modelo,
          year: semiTrailer.Ano,
          type: { name: semiTrailer.Tipo },
          cargos: semiTrailer.Cargas?.split(',').map((name) => ({
            name,

            id: 1, // ignore
          })),
          configuration: {
            name: semiTrailer.Configuração,
            numberOfTrailers: trailers.length,
          },
          axle: semiTrailer.Eixos ? 4 : null,

          trailers,

          brandId: 1, // ignore
          configurationId: 1, // ignore
          typeId: 1, // ignore
        }
      }),
    )

    const configurations = await db.trailerConfiguration.findMany({
      where: {
        name: { in: parsedData.map(({ configuration }) => configuration.name) },
      },
    })

    const semiTrailersExists = await db.semiTrailer.findMany({
      where: {
        trailers: {
          some: {
            vehicle: {
              licensePlate: {
                in: parsedData.flatMap(({ trailers }) =>
                  trailers.map(({ vehicle }) => vehicle.licensePlate),
                ),
              },
            },
          },
        },
      },
      select: {
        id: true,
        trailers: {
          select: {
            id: true,
            vehicleId: true,
            vehicle: { select: { licensePlate: true } },
          },
        },
      },
    })

    semiTrailers = await db.$transaction(
      parsedData.map(({ trailers, ...semiTrailer }) => {
        const numberOfTrailers = configurations.find(
          ({ name }) => name === semiTrailer.configuration.name,
        )?.numberOfTrailers

        if (numberOfTrailers && numberOfTrailers !== trailers.length) {
          throw new Error()
        }

        const semiTrailerExists = semiTrailersExists.find((semiTrailer) =>
          trailers.every(({ vehicle }) =>
            semiTrailer.trailers.some(
              ({ vehicle: { licensePlate } }) =>
                licensePlate === vehicle.licensePlate,
            ),
          ),
        )

        if (semiTrailerExists) {
          return db.semiTrailer.update({
            where: { id: semiTrailerExists.id },
            data: {
              type: {
                connectOrCreate: {
                  where: { name: semiTrailer.type.name },
                  create: { name: semiTrailer.type.name },
                },
              },
              cargos: {
                connectOrCreate: semiTrailer.cargos.map(({ name }) => ({
                  where: { name },
                  create: { name },
                })),
              },
              configuration: {
                connectOrCreate: {
                  where: { name: semiTrailer.configuration.name },
                  create: {
                    name: semiTrailer.configuration.name,
                    numberOfTrailers:
                      semiTrailer.configuration.numberOfTrailers,
                  },
                },
              },

              trailers: {
                update: trailers.map(({ vehicle, fleetNumber }) => ({
                  where: {
                    vehicleId: semiTrailerExists.trailers.find(
                      ({ vehicle: { licensePlate } }) =>
                        licensePlate === vehicle.licensePlate,
                    )?.vehicleId,
                  },
                  data: {
                    vehicle: {
                      update: {
                        unit: { connect: { companyId: semiTrailer.unitId } },

                        brand: {
                          connectOrCreate: {
                            where: { name: semiTrailer.brand.name },
                            create: { name: semiTrailer.brand.name },
                          },
                        },
                        model: semiTrailer.model,
                        year: semiTrailer.year,

                        licensePlate: vehicle.licensePlate,
                        chassis: vehicle.chassis,
                        renavam: vehicle.renavam,
                      },
                    },
                    fleetNumber,
                  },
                })),
              },
            },
          })
        }

        return db.semiTrailer.create({
          data: {
            type: {
              connectOrCreate: {
                where: { name: semiTrailer.type.name },
                create: { name: semiTrailer.type.name },
              },
            },
            cargos: {
              connectOrCreate: semiTrailer.cargos.map(({ name }) => ({
                where: { name },
                create: { name },
              })),
            },
            configuration: {
              connectOrCreate: {
                where: { name: semiTrailer.configuration.name },
                create: {
                  name: semiTrailer.configuration.name,
                  numberOfTrailers: semiTrailer.configuration.numberOfTrailers,
                },
              },
            },

            trailers: {
              create: trailers.map(({ vehicle, fleetNumber }) => ({
                vehicle: {
                  create: {
                    unit: { connect: { companyId: semiTrailer.unitId } },

                    brand: {
                      connectOrCreate: {
                        where: { name: semiTrailer.brand.name },
                        create: { name: semiTrailer.brand.name },
                      },
                    },
                    model: semiTrailer.model,
                    year: semiTrailer.year,

                    licensePlate: vehicle.licensePlate,
                    chassis: vehicle.chassis,
                    renavam: vehicle.renavam,
                  },
                },
                fleetNumber,
              })),
            },
          },
        })
      }),
    )
  } catch (error) {
    console.error(error)
    return { error: 'Erro ao importar os semirreboques' }
  }

  revalidatePath('/semi-trailers')

  return { data: semiTrailers }
}

export const importManyAction = safeAction(arraySchema, handler)
