import { CompanyWithDocumentTypeSchema } from '@/actions/company/schema'
import { z } from 'zod'

export const UnitIdSchema = z.object({
  companyId: z.number().int().positive(),
})

export const UnitSchema = z.object({
  company: CompanyWithDocumentTypeSchema,
})

export const UnitUpdateSchema = UnitIdSchema.merge(UnitSchema.deepPartial())
