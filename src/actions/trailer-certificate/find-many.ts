'use server'

import { db } from '@/lib/db'
import { TrailerCertificate } from '@prisma/client'

export const findManyAction = async (): Promise<{
  data: TrailerCertificate[]
}> => {
  const trailerCertificates = await db.trailerCertificate.findMany()

  return { data: trailerCertificates }
}
