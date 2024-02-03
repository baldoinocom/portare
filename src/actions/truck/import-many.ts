'use server'

import { BrandSchema } from '@/actions/brand/schema'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Truck } from '@prisma/client'
import { z } from 'zod'
import { TruckImportSchema, TruckSchema } from './schema'

type InputType = z.infer<typeof TruckImportSchema>
type ReturnType = ActionState<InputType, Truck[]>

const handler = async (data: InputType): Promise<ReturnType> => {
  let trucks

  try {
    trucks = await db.$transaction(
      data.map((truck) => {
        console.log('truck', truck)

        const value = TruckSchema.and(
          z.object({ vehicle: z.object({ brand: BrandSchema }) }),
        ).parse({
          vehicle: {
            licensePlate: truck.Placa,
            model: truck.Modelo,
            year: truck.Ano,
            axle: truck.Eixo ? 4 : null,
            chassis: truck.Chassi,
            renavam: truck.Renavam,
            brand: { name: truck.Marca },
            unitId: truck.Frota === 'Unidade' ? 1 : null,
          },
          compressor: truck.Compressor === 'SIM',
        })

        return db.truck.create({
          data: {
            compressor: value.compressor,
            vehicle: {
              create: {
                licensePlate: value.vehicle.licensePlate,
                year: value.vehicle.year || null,
                model: value.vehicle.model || null,
                axle: value.vehicle.axle || null,
                chassis: value.vehicle.chassis || null,
                renavam: value.vehicle.renavam || null,
                brand: value.vehicle.brand.name
                  ? {
                      connectOrCreate: {
                        where: { name: value.vehicle.brand.name },
                        create: { name: value.vehicle.brand.name },
                      },
                    }
                  : undefined,
                unit: value.vehicle.unitId
                  ? { connect: { companyId: value.vehicle.unitId } }
                  : undefined,
              },
            },
          },
        })
      }),
    )
  } catch (error) {
    return { error: JSON.stringify(error) }
  }

  return { data: trucks }
}

export const importManyAction = safeAction(TruckImportSchema, handler)
