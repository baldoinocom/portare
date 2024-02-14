'use server'

import {
  TrailerCertificateResource,
  trailerCertificateResource,
} from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{
  data: TrailerCertificateResource[]
}> => {
  const trailerCertificates = await db.trailerCertificate.findMany(
    trailerCertificateResource,
  )

  return { data: trailerCertificates }
}
