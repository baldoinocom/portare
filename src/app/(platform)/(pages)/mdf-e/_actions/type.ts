import { z } from 'zod'

export const MDFeSchema = z.object({
  Manifesto: z.string(),
  Filial: z.string(),
  Caminhão: z.string(),
  Reboque: z.string().optional(),
  Destinatário: z.string(),
  Endereço: z.string(),
  'Nota Fiscal': z.string(),
  'Emissão da Nf': z.string(),
  CTe: z.string(),
  'Emissão do CTe': z.string(),
})

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
