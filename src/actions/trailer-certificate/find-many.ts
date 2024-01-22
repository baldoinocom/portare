'use server'

import { TrailerCertificateInclude } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: TrailerCertificateInclude[]
}> => {
  const trailerCertificates = await db.trailerCertificate.findMany({
    include: {
      trailer: { include: { vehicle: { include: { brand: true } } } },
    },
  })

  return { data: trailerCertificates }
}
