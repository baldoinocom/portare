'use server'

import { DriverResource, driverResource } from '@/actions/types'
import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { z } from 'zod'
import { DriverIdSchema } from './schema'

type InputType = z.infer<typeof DriverIdSchema>
type ReturnType = ActionState<InputType, DriverResource>

const handler = async (data: InputType): Promise<ReturnType> => {
  const { personId } = data

  let driver

  try {
    driver = await db.driver.findUniqueOrThrow({
      where: { personId },
      include: driverResource.include,
    })
  } catch (error) {
    return {
      error: 'Não encontramos nenhum dado com o ID informado',
    }
  }

  return { data: driver }
}

export const findAction = safeAction(DriverIdSchema, handler)
