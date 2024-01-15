'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerCertificate } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TrailerCertificateIdSchema } from './schema'

type InputType = z.infer<typeof TrailerCertificateIdSchema>
type ReturnType = ActionState<InputType, TrailerCertificate>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, trailerId } = data

  let trailerCertificate

  try {
    trailerCertificate = await db.trailerCertificate.delete({
      where: { id_trailerId: { id, trailerId } },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao deletar, tente novamente mais tarde' }
  }

  revalidatePath('/trailer-certificates')

  return { data: trailerCertificate }
}

export const deleteAction = safeAction(TrailerCertificateIdSchema, handler)
