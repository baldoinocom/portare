import { AddressSchema } from '@/actions/address/schema'
import { extractNumber } from '@/lib/utils'
import { validCNPJ, validCPF } from '@/lib/validators'
import { CompanyType } from '@prisma/client'
import { z } from 'zod'

export const CompanyIdSchema = z.object({
  id: z.number().int().positive(),
})

const CompanySchema = z.object({
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

  type: z.optional(
    z
      .nativeEnum(CompanyType, {
        invalid_type_error: 'O tipo de empresa é inválido',
        required_error: 'O tipo de empresa é obrigatório',
      })
      .nullish(),
  ),

  document: z.optional(z.string().trim().transform(extractNumber)),

  address: z.optional(AddressSchema),
})

export const CompanyWithDocumentTypeSchema = CompanySchema.refine(
  ({ type, document }) =>
    type === CompanyType.cpf ? validCPF(document) : validCNPJ(document),
  { path: ['document'], message: 'O documento deve ser válido' },
)

export const CompanyUpdateSchema = CompanyIdSchema.merge(
  CompanySchema.deepPartial(),
).refine(
  ({ type, document }) => {
    if (type && document) {
      return type === CompanyType.cpf ? validCPF(document) : validCNPJ(document)
    }
    return true
  },
  { path: ['document'], message: 'O documento deve ser válido' },
)
