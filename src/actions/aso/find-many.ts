'use server'

import { ASO } from '@/actions/types'
import { db } from '@/lib/db'

export const findManyAction = async (): Promise<{ data: ASO[] }> => {
  const aso = await db.aSO.findMany({
    include: { driver: { include: { person: true } } },
  })

  return { data: aso }
}
