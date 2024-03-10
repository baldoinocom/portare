'use server'

import { action } from '@/actions'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Company, CompanyType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { CompanyUpdateSchema } from './schema'

type InputType = z.infer<typeof CompanyUpdateSchema>
type ReturnType = ActionState<InputType, Company>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, name, tradeName, type, document, address } = data

  let company
  let companyAddress

  try {
    if (document) {
      const find = await db.company.findFirst({
        where: { NOT: { id }, document },
      })

      if (find) {
        return { error: 'Já existe uma empresa com esse documento' }
      }
    }

    // if (type || document) {
    //   const find = await db.company.findFirst({ where: { id } })

    //   if (emptyAsNull(document) !== find?.document || type !== find?.type) {
    //     if (
    //       validDocument(
    //         document || find?.document || undefined,
    //         type || find?.type || undefined,
    //       )
    //     ) {
    //       return {
    //         error: 'O documento informado é inválido',
    //       }
    //     }
    //   }
    // }

    company = await db.company.update({
      where: { id },
      data: {
        name,
        tradeName: type === CompanyType.cpf ? name : emptyAsNull(tradeName),
        type: type || undefined,
        document: emptyAsNull(document),
      },
    })

    if (address && Object.keys(address).length) {
      if (company.addressId) {
        const { data, error } = await action
          .address()
          .update({ id: company.addressId, ...address })

        if (error) return { error }

        companyAddress = data
      } else {
        const { data, error } = await action.address().create(address)

        if (error) return { error }

        companyAddress = data
      }

      company = await db.company.update({
        where: { id },
        data: {
          address: companyAddress
            ? { connect: { id: companyAddress?.id } }
            : undefined,
        },
      })
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/companies/${id}`)
  revalidatePath('/companies')

  return { data: company }
}

export const updateAction = safeAction(CompanyUpdateSchema, handler)
