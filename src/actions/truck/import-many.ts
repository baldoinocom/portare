'use server'

import { BrandSchema } from '@/actions/brand/schema'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Truck } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TruckImportSchema, TruckSchema } from './schema'

const arraySchema = z.array(TruckImportSchema)

type InputType = z.infer<typeof arraySchema>
type ReturnType = ActionState<InputType, Truck[]>

const handler = async (data: InputType): Promise<ReturnType> => {
  let trucks

  try {
    const trucksSchema = z.array(
      z.object({ vehicle: z.object({ brand: BrandSchema }) }).and(TruckSchema),
    )

    const parsedData = trucksSchema.parse(
      data.map((truck) => ({
        vehicle: {
          unitId: Number(truck.Unidade) || undefined,
          aggregateId: Number(truck.Agregado) || undefined,

          licensePlate: truck.Placa,
          brand: { name: truck.Marca },
          model: truck.Modelo,
          year: truck.Ano,
          axle: truck.Eixos ? 4 : null,
          chassis: truck.Chassi,
          renavam: truck.Renavam,

          brandId: 1, // ignore
        },
        compressor: Boolean(truck['Compressor - Modelo']),
        compressorModel: truck['Compressor - Modelo'],
      })),
    )

    const trucksExists = await db.truck.findMany({
      where: {
        vehicle: {
          OR: parsedData.map(({ vehicle }) => ({
            licensePlate: vehicle.licensePlate,
          })),
        },
      },
      select: { id: true, vehicle: { select: { licensePlate: true } } },
    })

    trucks = await db.$transaction(
      parsedData.map(({ vehicle, compressor, compressorModel }) => {
        const truckExists = trucksExists.find(
          ({ vehicle: { licensePlate } }) =>
            licensePlate === vehicle.licensePlate,
        )

        if (truckExists) {
          return db.truck.update({
            where: { id: truckExists.id },
            data: {
              vehicle: {
                update: {
                  unit: vehicle.unitId
                    ? { connect: { companyId: vehicle.unitId } }
                    : undefined,
                  aggregate: vehicle.aggregateId
                    ? { connect: { companyId: vehicle.aggregateId } }
                    : undefined,

                  licensePlate: vehicle.licensePlate,
                  brand: {
                    connectOrCreate: {
                      where: { name: vehicle.brand.name },
                      create: { name: vehicle.brand.name },
                    },
                  },
                  year: vehicle.year,
                  model: vehicle.model,
                  axle: vehicle.axle,
                  chassis: vehicle.chassis,
                  renavam: vehicle.renavam,
                },
              },
              compressor,
              compressorModel: compressor ? compressorModel : null,
            },
          })
        }

        return db.truck.create({
          data: {
            vehicle: {
              create: {
                unit: vehicle.unitId
                  ? { connect: { companyId: vehicle.unitId } }
                  : undefined,
                aggregate: vehicle.aggregateId
                  ? { connect: { companyId: vehicle.aggregateId } }
                  : undefined,

                licensePlate: vehicle.licensePlate,
                brand: {
                  connectOrCreate: {
                    where: { name: vehicle.brand.name },
                    create: { name: vehicle.brand.name },
                  },
                },
                year: vehicle.year,
                model: vehicle.model,
                axle: vehicle.axle,
                chassis: vehicle.chassis,
                renavam: vehicle.renavam,
              },
            },
            compressor,
            compressorModel: compressor ? compressorModel : null,
          },
        })
      }),
    )
  } catch (error) {
    return { error: 'Erro ao importar os caminhões' }
  }

  revalidatePath('/trucks')

  return { data: trucks }
}

export const importManyAction = safeAction(arraySchema, handler)
