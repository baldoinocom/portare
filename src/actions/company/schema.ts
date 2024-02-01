import { extractNumber } from '@/lib/utils'
import { validCNPJ } from '@/lib/validators'
import { UF } from '@prisma/client'
import { z } from 'zod'

export const CompanyIdSchema = z.object({
  id: z.number().int().positive(),
})

export const CompanySchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório' })
    .trim()
    .toUpperCase()
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    .max(255, { message: 'O nome não pode ter mais de 255 caracteres' }),

  tradeName: z.optional(
    z
      .string()
      .trim()
      .toUpperCase()
      .max(50, { message: 'O apelido não pode ter mais de 50 caracteres' }),
  ),

  cnpj: z.optional(
    z
      .string()
      .trim()
      .transform(extractNumber)
      .refine(({ length }) => !length || length === 14, {
        message: 'O CNPJ deve ter exatamente 14 dígitos',
      })
      .refine((value) => validCNPJ(value), {
        message: 'O CNPJ deve ser válido',
      }),
  ),

  address: z.optional(
    z
      .string()
      .trim()
      .toUpperCase()
      .max(255, { message: 'O endereço não pode ter mais de 255 caracteres' }),
  ),

  uf: z.optional(
    z
      .nativeEnum(UF, {
        invalid_type_error: 'O UF é inválido',
      })
      .nullish(),
  ),
})

export const CompanyUpdateSchema = CompanyIdSchema.merge(
  CompanySchema.deepPartial(),
)
