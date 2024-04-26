'use server'

import { db } from '@/lib/db'
import { formatUF } from '@/lib/formatters'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Unit } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { UnitImportSchema, UnitSchema } from './schema'

const arraySchema = z.array(UnitImportSchema)

type InputType = z.infer<typeof arraySchema>
type ReturnType = ActionState<InputType, Unit[]>

const handler = async (data: InputType): Promise<ReturnType> => {
  let units

  try {
    const unitsSchema = z.array(UnitSchema)

    const parsedData = unitsSchema.parse(
      data.map((unit) => {
        const address = {
          zipCode: unit.CEP,
          state: formatUF(unit.Estado),
          city: unit.Cidade,
          locale: unit.Endereço,
        }

        return {
          company: {
            name: unit.Nome,
            tradeName: unit['Nome fantasia'],
            document: unit.CNPJ,
            address: Object.values(address).some(Boolean) ? address : undefined,
          },
        }
      }),
    )

    units = await db.$transaction(
      parsedData.map(({ company }) => {
        return db.unit.create({
          data: {
            company: {
              create: {
                name: company.name,
                tradeName: company.tradeName,
                document: company.document,
                address: company.address
                  ? {
                      create: {
                        zipCode: company.address.zipCode,
                        state: company.address.state,
                        city: company.address.city,
                        locale: company.address.locale,
                      },
                    }
                  : undefined,
              },
            },
          },
        })
      }),
    )
  } catch (error) {
    return { error: 'Erro ao importar os unidades' }
  }

  revalidatePath('/units')

  return { data: units }
}

export const importManyAction = safeAction(arraySchema, handler)
