'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Company } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { CompanySchema } from './schema'

type InputType = z.infer<typeof CompanySchema>
type ReturnType = ActionState<InputType, Company>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, tradeName, cnpj, address, uf } = data

  let company

  try {
    if (cnpj) {
      const find = await db.company.findFirst({ where: { cnpj } })

      if (find) {
        return { error: 'Já existe uma empresa com esse CNPJ' }
      }
    }

    company = await db.company.create({
      data: {
        name,
        tradeName: emptyAsNull(tradeName),
        cnpj: emptyAsNull(cnpj),
        address: emptyAsNull(address),
        uf,
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/companies')

  return { data: company }
}

export const createAction = safeAction(CompanySchema, handler)
