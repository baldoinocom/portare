'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Address } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AddressUpdateSchema } from './schema'

type InputType = z.infer<typeof AddressUpdateSchema>
type ReturnType = ActionState<InputType, Address>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, zipCode, state, city, locale } = data

  let address

  try {
    const createData = {
      zipCode: emptyAsNull(zipCode),
      state: emptyAsNull(state),
      city: emptyAsNull(city),
      locale: emptyAsNull(locale),
    }

    if (Object.values(createData).every((v) => v === null)) {
      await db.address.delete({ where: { id } })

      return { data: undefined }
    }

    address = await db.address.update({ where: { id }, data: createData })

    if (!Object.values(createData).some(Boolean)) {
      await db.address.delete({ where: { id } })

      return { data: undefined }
    }
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/addresses/${id}`)
  revalidatePath('/addresses')

  return { data: address }
}

export const updateAction = safeAction(AddressUpdateSchema, handler)
