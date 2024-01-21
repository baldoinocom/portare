import { CompanySchema } from '@/actions/company/schema'
import { z } from 'zod'

export const UnitIdSchema = z.object({
  companyId: z.number().int().positive(),
})

export const UnitSchema = z.object({
  company: CompanySchema,
})

export const UnitUpdateSchema = UnitIdSchema.merge(UnitSchema.deepPartial())
