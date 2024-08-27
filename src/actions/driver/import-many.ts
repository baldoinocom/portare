'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Driver } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { DriverImportSchema, DriverSchema } from './schema'

const arraySchema = z.array(DriverImportSchema)

type InputType = z.infer<typeof arraySchema>
type ReturnType = ActionState<InputType, Driver[]>

const handler = async (data: InputType): Promise<ReturnType> => {
  let drivers

  try {
    const driversSchema = z.array(DriverSchema)

    const parsedData = driversSchema.parse(
      data.map((driver) => ({
        person: {
          unitId: Number(driver.Unidade) || undefined,
          aggregateId: Number(driver.Agregado) || undefined,

          name: driver.Nome,
          nickname: driver.Apelido,
          document: driver.CPF,
          phoneNumber: driver.Telefone,
        },
        cnh: driver.CNH,
        cnhMirror: driver['CNH espelho'],
      })),
    )

    const driversExists = await db.driver.findMany({
      where: {
        person: {
          OR: parsedData.map(({ person }) => ({ document: person.document })),
        },
      },
      select: { personId: true, person: { select: { document: true } } },
    })

    drivers = await db.$transaction(
      parsedData.map(({ person, cnh, cnhMirror }) => {
        const driverExists = driversExists.find(
          ({ person: { document } }) => document === person.document,
        )

        if (driverExists) {
          return db.driver.update({
            where: { personId: driverExists.personId },
            data: {
              person: {
                update: {
                  unit: person.unitId
                    ? { connect: { companyId: person.unitId } }
                    : undefined,
                  aggregate: person.aggregateId
                    ? { connect: { companyId: person.aggregateId } }
                    : undefined,

                  name: person.name,
                  nickname: person.nickname,
                  document: person.document,
                  phoneNumber: person.phoneNumber,
                },
              },
              cnh,
              cnhMirror,
            },
          })
        }

        return db.driver.create({
          data: {
            person: {
              create: {
                unit: person.unitId
                  ? { connect: { companyId: person.unitId } }
                  : undefined,
                aggregate: person.aggregateId
                  ? { connect: { companyId: person.aggregateId } }
                  : undefined,

                name: person.name,
                nickname: person.nickname,
                document: person.document,
                phoneNumber: person.phoneNumber,
              },
            },
            cnh,
            cnhMirror,
          },
        })
      }),
    )
  } catch (error) {
    return { error: 'Erro ao importar os motoristas' }
  }

  revalidatePath('/drivers')

  return { data: drivers }
}

export const importManyAction = safeAction(arraySchema, handler)
