'use server'

import { db } from '@/lib/db'
import { Trip } from '@prisma/client'

export const findManyAction = async (): Promise<{ data: Trip[] }> => {
  const trips = await db.trip.findMany()

  return { data: trips }
}
