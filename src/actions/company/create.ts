'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Company, CompanyType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { CompanyWithDocumentTypeSchema } from './schema'

type InputType = z.infer<typeof CompanyWithDocumentTypeSchema>
type ReturnType = ActionState<InputType, Company>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, tradeName, type, document, address } = data

  let company
  let companyAddress

  try {
    if (document) {
      const find = await db.company.findFirst({ where: { document } })

      if (find) {
        return { error: 'Já existe uma empresa com esse documento' }
      }
    }

    if (address && Object.keys(address).length) {
      const { data, error } = await action.address().create(address)

      if (error) return { error }

      companyAddress = data
    }

    company = await db.company.create({
      data: {
        name,
        tradeName: type === CompanyType.cpf ? name : emptyAsNull(tradeName),
        type: type || CompanyType.cnpj,
        document: emptyAsNull(document),
        address: companyAddress
          ? { connect: { id: companyAddress.id } }
          : undefined,
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/companies')

  return { data: company }
}

export const createAction = safeAction(CompanyWithDocumentTypeSchema, handler)
