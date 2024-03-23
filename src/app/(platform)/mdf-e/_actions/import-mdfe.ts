'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { shieldAction } from '@/lib/shield-action'
import { revalidatePath } from 'next/cache'
import { MDFeSchema, MDFeType } from './type'

type ReturnType = ActionState<MDFeType, string>

const handler = async (data: MDFeType): Promise<ReturnType> => {
  try {
    await db.mDFe.createMany({
      skipDuplicates: true,
      data: data.map(({ 'No.Manifesto': id, Filial: branch, ...json }) => ({
        id,
        branch: branch?.includes('18-') ? 'pr' : 'sc',
        data: json,
      })),
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao importar, tente novamente mais tarde' }
  }

  revalidatePath('/mdf-e')

  return { data: 'Importação realizada com sucesso' }
}

const action = safeAction(MDFeSchema, handler)

export const importMDFe = shieldAction({ action, permission: 'mdfe.view' })
