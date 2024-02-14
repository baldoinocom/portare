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
  })
  .array()

export const MDFeUpdateSchema = z
  .object({ id: z.number(), closed: z.boolean() })
  .array()

export type MDFeType = z.infer<typeof MDFeSchema>

export type MDFeResource = MDFe & { data: MDFeType[0] }
