import { CompanySchema } from '@/actions/company/schema'
import { z } from 'zod'

export const FleetIdSchema = z.object({
  companyId: z.number().int().positive(),
})

export const FleetSchema = z.object({
  company: CompanySchema,
})

export const FleetUpdateSchema = FleetIdSchema.merge(FleetSchema.deepPartial())
