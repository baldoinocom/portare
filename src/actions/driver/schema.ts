import {
  PersonWithRelationshipTypeSchema,
  PersonWithUniqueRelationshipSchema,
} from '@/actions/person/schema'
import { z } from 'zod'

export const DriverIdSchema = z.object({
  personId: z.number().int().positive(),
})

export const DriverSchema = z.object({
  person: PersonWithUniqueRelationshipSchema,
})

export const DriverWithRelationshipTypeSchema = z.object({
  person: PersonWithRelationshipTypeSchema,
})

export const DriverUpdateSchema = DriverIdSchema.merge(
  DriverSchema.deepPartial(),
)
