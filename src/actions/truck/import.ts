'use server'

import { db } from '@/lib/db'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const importTruckAction = async (trucks: any) => {
  await db.$transaction(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trucks.map((truck: any) =>
      db.truck.create({
        data: {
          compressor: truck.compressor,
          vehicle: {
            connectOrCreate: {
              where: { licensePlate: truck.vehicle.licensePlate },
              create: {
                licensePlate: truck.vehicle.licensePlate,
                year: truck.vehicle.year,
                model: truck.vehicle.model,
                axle: truck.vehicle.axle,
                chassis: truck.vehicle.chassis,
                renavam: truck.vehicle.renavam,
                brand: {
                  connectOrCreate: {
                    where: { name: truck.vehicle.brand },
                    create: { name: truck.vehicle.brand },
                  },
                },
                unit: truck.vehicle.unitId
                  ? { connect: { companyId: truck.vehicle.unitId } }
                  : undefined,
              },
            },
          },
        },
      }),
    ),
  )
}
