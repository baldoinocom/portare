'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerCertificate } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TrailerCertificateUpdateSchema } from './schema'

type InputType = z.infer<typeof TrailerCertificateUpdateSchema>
type ReturnType = ActionState<InputType, TrailerCertificate>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, trailerId, startedAt, expirationType } = data

  let trailerCertificate

  try {
    trailerCertificate = await db.trailerCertificate.update({
      where: { id_trailerId: { id, trailerId } },
      data: { startedAt, expirationType },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao atualizar, tente novamente mais tarde' }
  }

  revalidatePath(`/trailer-certificates/${id}`)
  revalidatePath('/trailer-certificates')

  return { data: trailerCertificate }
}

export const updateAction = safeAction(TrailerCertificateUpdateSchema, handler)
