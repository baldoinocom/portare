'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { TrailerCertificate } from '@prisma/client'
import { z } from 'zod'
import { TrailerCertificateIdSchema } from './schema'

type InputType = z.infer<typeof TrailerCertificateIdSchema>
type ReturnType = ActionState<InputType, TrailerCertificate>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, trailerId } = data

  let trailerCertificate

  try {
    trailerCertificate = await db.trailerCertificate.findUniqueOrThrow({
      where: { id_trailerId: { id, trailerId } },
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: trailerCertificate }
}

export const findAction = safeAction(TrailerCertificateIdSchema, handler)
