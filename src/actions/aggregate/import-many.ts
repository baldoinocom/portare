'use server'

import { db } from '@/lib/db'
import { formatShortState } from '@/lib/formatters'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Aggregate, CompanyType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AggregateImportSchema, AggregateSchema } from './schema'

const arraySchema = z.array(AggregateImportSchema)

type InputType = z.infer<typeof arraySchema>
type ReturnType = ActionState<InputType, Aggregate[]>

const handler = async (data: InputType): Promise<ReturnType> => {
  let aggregates

  try {
    const aggregatesSchema = z.array(AggregateSchema)

    const parsedData = aggregatesSchema.parse(
      data.map((aggregate) => {
        const type = aggregate['Tipo (CNPJ/CPF)']?.toLowerCase()
        const isCPF = type === CompanyType.cpf

        const address = {
          zipCode: aggregate.CEP,
          state: formatShortState(aggregate.Estado),
          city: aggregate.Cidade,
          locale: aggregate.Endereço,
        }

        return {
          unitId: Number(aggregate.Unidade),
          company: {
            type,

            name: aggregate.Nome,
            tradeName: isCPF ? aggregate.Nome : aggregate['Nome fantasia'],
            document: isCPF ? aggregate.CPF : aggregate.CNPJ,
            address: Object.values(address).some(Boolean) ? address : undefined,
          },
        }
      }),
    )

    const aggregatesExists = await db.aggregate.findMany({
      where: {
        company: {
          OR: parsedData.map(({ company }) => ({ document: company.document })),
        },
      },
      select: { companyId: true, company: { select: { document: true } } },
    })

    aggregates = await db.$transaction(
      parsedData.map(({ unitId, company }) => {
        const aggregateExists = aggregatesExists.find(
          ({ company: { document } }) => document === company.document,
        )

        if (aggregateExists) {
          return db.aggregate.update({
            where: { companyId: aggregateExists.companyId },
            data: {
              unit: unitId ? { connect: { companyId: unitId } } : undefined,
              company: {
                update: {
                  type: company.type as CompanyType,

                  name: company.name,
                  tradeName: company.tradeName,
                  document: company.document,
                  address: company.address
                    ? {
                        update: {
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
        }

        return db.aggregate.create({
          data: {
            unit: unitId ? { connect: { companyId: unitId } } : undefined,
            company: {
              create: {
                type: company.type as CompanyType,

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
    return { error: 'Erro ao importar os agregados' }
  }

  revalidatePath('/aggregates')

  return { data: aggregates }
}

export const importManyAction = safeAction(arraySchema, handler)
