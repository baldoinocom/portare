'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Company } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { CompanyUpdateSchema } from './schema'

type InputType = z.infer<typeof CompanyUpdateSchema>
type ReturnType = ActionState<InputType, Company>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, name, tradeName, cnpj, address, uf } = data

  let company

  try {
    if (cnpj) {
      const find = await db.company.findFirst({ where: { NOT: { id }, cnpj } })

      if (find) {
        return { error: 'Já existe uma empresa com esse CNPJ' }
      }
    }

    company = await db.company.update({
      where: { id },
      data: {
        name,
        tradeName: emptyAsNull(tradeName),
        cnpj: emptyAsNull(cnpj),
        address: emptyAsNull(address),
        uf,
      },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/companies/${id}`)
  revalidatePath('/companies')

  return { data: company }
}

export const updateAction = safeAction(CompanyUpdateSchema, handler)
