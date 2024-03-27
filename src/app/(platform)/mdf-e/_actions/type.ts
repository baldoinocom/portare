import { MDFe } from '@prisma/client'
import { z } from 'zod'

export const MDFeSchema = z
  .object({
    'Dt. Emissao': z.string(),
    'Emis Nf Cli': z.string(),
    Filial: z.string(),
    'Local Entreg': z.string(),
    'NF CLIENTE': z.string(),
    'No.Manifesto': z.coerce.number(),
    'Nome Destina': z.string(),
    'Numero CTRC': z.string(),
    'Placa Veicul': z.string(),
    'Placa Reboque': z.string().optional(),
  })
  .array()

export const MDFeUpdateSchema = z.object({
  id: z.number(),

  closed: z.optional(z.boolean()),

  note: z.optional(
    z
      .string()
      .trim()
      .max(255, { message: 'A observação deve ter no máximo 255 caracteres' }),
  ),
})

export type MDFeType = z.infer<typeof MDFeSchema>

export type MDFeResource = MDFe & { data: MDFeType[0] }
