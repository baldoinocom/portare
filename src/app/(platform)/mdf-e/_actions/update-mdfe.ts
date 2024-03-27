'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { shieldAction } from '@/lib/shield-action'
import { emptyAsNull } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { MDFeUpdateSchema } from './type'

const arraySchema = z.array(MDFeUpdateSchema)

type InputType = z.infer<typeof arraySchema>
type ReturnType = ActionState<InputType, string>

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    await db.$transaction(
      data.map(({ id, closed, note }) =>
        db.mDFe.update({
          where: { id },
          data: {
            closedAt: closed ? new Date() : null,
            note: emptyAsNull(note),
          },
        }),
      ),
    )
  } catch (error) {
    return { error: 'Ocorreu um erro ao alterar, tente novamente mais tarde' }
  }

  revalidatePath('/mdf-e')

  return { data: 'Alterados com sucesso' }
}

const action = safeAction(arraySchema, handler)

export const updateMDFe = shieldAction({ action, permission: 'mdfe.view' })
