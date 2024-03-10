'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { emptyAsNull } from '@/lib/utils'
import { Address } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { AddressSchema } from './schema'

type InputType = z.infer<typeof AddressSchema>
type ReturnType = ActionState<InputType, Address | undefined>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { zipCode, state, city, locale } = data

  let address

  try {
    const createData = {
      zipCode: emptyAsNull(zipCode),
      state: emptyAsNull(state),
      city: emptyAsNull(city),
      locale: emptyAsNull(locale),
    }

    if (!Object.values(createData).some(Boolean)) {
      return { data: undefined }
    }

    address = await db.address.create({ data: createData })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/addresses')

  return { data: address }
}

export const createAction = safeAction(AddressSchema, handler)
