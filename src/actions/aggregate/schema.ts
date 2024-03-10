import { CompanyWithDocumentTypeSchema } from '@/actions/company/schema'
import { z } from 'zod'

export const AggregateIdSchema = z.object({
  companyId: z.number().int().positive(),
})

export const AggregateSchema = z.object({
  company: CompanyWithDocumentTypeSchema,

  unitId: z
    .number({ required_error: 'A unidade é obrigatória' })
    .int()
    .positive(),
})

export const AggregateUpdateSchema = AggregateIdSchema.merge(
  AggregateSchema.deepPartial(),
)

export const AggregateImportSchema = z.object({
  Unidade: z.coerce.string().nullish(),

  'Tipo (CNPJ/CPF)': z.coerce.string().nullish(),

  Nome: z.coerce.string().nullish(),
  'Nome fantasia': z.coerce.string().nullish(),
  CNPJ: z.coerce.string().nullish(),
  CPF: z.coerce.string().nullish(),

  CEP: z.coerce.string().nullish(),
  Estado: z.coerce.string().nullish(),
  Cidade: z.coerce.string().nullish(),
  Endereço: z.coerce.string().nullish(),
})
