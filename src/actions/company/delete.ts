'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { Company } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { CompanyIdSchema } from './schema'

type InputType = z.infer<typeof CompanyIdSchema>
type ReturnType = ActionState<InputType, Company>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data

  let company

  try {
    company = await db.company.delete({ where: { id } })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/companies')

  return { data: company }
}

export const deleteAction = safeAction(CompanyIdSchema, handler)
