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
