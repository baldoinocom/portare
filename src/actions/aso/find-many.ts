'use server'

import { ASOResource, aSOResource } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: ASOResource[] }> => {
  const aso = await db.aSO.findMany(aSOResource)

  return { data: aso }
}
