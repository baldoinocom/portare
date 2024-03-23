'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { shieldAction } from '@/lib/shield-action'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { MDFeUpdateSchema } from './type'

type InputType = z.infer<typeof MDFeUpdateSchema>
type ReturnType = ActionState<InputType, string>

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    await db.$transaction(
      data.map(({ id, closed }) =>
        db.mDFe.update({
          where: { id },
          data: { closedAt: closed ? new Date() : null },
        }),
      ),
    )
  } catch (error) {
    return { error: 'Ocorreu um erro ao alterar, tente novamente mais tarde' }
  }

  revalidatePath('/mdf-e')

  return { data: 'Alterados com sucesso' }
}

const action = safeAction(MDFeUpdateSchema, handler)

export const updateMDFe = shieldAction({ action, permission: 'mdfe.view' })
