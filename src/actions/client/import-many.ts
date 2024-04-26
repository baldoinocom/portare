'use server'

import { db } from '@/lib/db'
import { formatUF } from '@/lib/formatters'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Client, ClientType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { ClientImportSchema, ClientSchema } from './schema'

const arraySchema = z.array(ClientImportSchema)

type InputType = z.infer<typeof arraySchema>
type ReturnType = ActionState<InputType, Client[]>

const handler = async (data: InputType): Promise<ReturnType> => {
  let clients

  try {
    const clientsSchema = z.array(ClientSchema)

    const parsedData = clientsSchema.parse(
      data.map((client) => {
        const address = {
          zipCode: client.CEP,
          state: formatUF(client.Estado),
          city: client.Cidade,
          locale: client.Endereço,
        }

        let type: ClientType
        switch (client['Tipo (Origem/Ambos/Destino)']?.toLowerCase()) {
          case 'origem':
            type = ClientType.origin
            break
          case 'destino':
            type = ClientType.destination
            break
          default:
            type = ClientType.both
            break
        }

        return {
          type,

          company: {
            name: client.Nome,
            tradeName: client['Nome fantasia'],
            document: client.CNPJ,
            address: Object.values(address).some(Boolean) ? address : undefined,
          },
        }
      }),
    )

    clients = await db.$transaction(
      parsedData.map(({ type, company }) => {
        return db.client.create({
          data: {
            type,

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
    console.error(error)
    return { error: 'Erro ao importar os clientes' }
  }

  revalidatePath('/clients')

  return { data: clients }
}

export const importManyAction = safeAction(arraySchema, handler)
