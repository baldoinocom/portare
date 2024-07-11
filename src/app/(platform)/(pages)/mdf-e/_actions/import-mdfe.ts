'use server'

import { db } from '@/lib/db'
import { ActionState, safeAction } from '@/lib/safe-action'
import { shieldAction } from '@/lib/shield-action'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { MDFeSchema } from './type'

const arraySchema = z.array(MDFeSchema)

type InputType = z.infer<typeof arraySchema>
type ReturnType = ActionState<InputType, string>

const branch = (branch: string) => (branch.includes('18-') ? 'pr' : 'sc')

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    await db.mDFe.createMany({
      skipDuplicates: true,
      data: data.map((item) => ({
        manifest: item.Manifesto,
        branch: branch(item.Filial),
        licensePlate: item.Caminhão,
        destinatary: item.Destinatário,
        address: item.Endereço,
        invoice: item['Nota Fiscal'],
        invoiceIssue: item['Emissão da Nf'],
        cte: item.CTe,
        cteIssue: item['Emissão do CTe'],
      })),
    })
  } catch (error) {
    return { error: 'Ocorreu um erro ao importar, tente novamente mais tarde' }
  }

  revalidatePath('/mdf-e')

  return { data: 'Importação realizada com sucesso' }
}

const action = safeAction(arraySchema, handler)

export const importMDFe = shieldAction({ action, permission: 'mdfe.view' })
