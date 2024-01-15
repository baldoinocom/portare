'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerCertificate } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { TrailerCertificateSchema } from './schema'

type InputType = z.infer<typeof TrailerCertificateSchema>
type ReturnType = ActionState<InputType, TrailerCertificate>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { trailerId, startedAt, expirationType } = data

  let trailerCertificate

  try {
    trailerCertificate = await db.trailerCertificate.create({
      data: { trailerId, startedAt, expirationType },
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao criar, tente novamente mais tarde' }
  }

  revalidatePath('/trailer-certificates')

  return { data: trailerCertificate }
}

export const createAction = safeAction(TrailerCertificateSchema, handler)
