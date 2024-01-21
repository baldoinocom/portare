import {
  PersonWithRelationshipTypeSchema,
  PersonWithUniqueRelationshipSchema,
} from '@/actions/person/schema'
import { validCNH } from '@/lib/validators'
import { z } from 'zod'

export const DriverIdSchema = z.object({
  personId: z.number().int().positive(),
})

export const DriverSchema = z.object({
  person: PersonWithUniqueRelationshipSchema,

  cnh: z.optional(
    z
      .string()
      .refine(({ length }) => !length || length === 11, {
        message: 'O CNH deve ter exatamente 11 dígitos',
      })
      .refine((value) => validCNH(value), {
        message: 'O CNH deve ser válido',
      }),
  ),
})

export const DriverWithRelationshipTypeSchema = DriverSchema.pick({
  cnh: true,
}).merge(z.object({ person: PersonWithRelationshipTypeSchema }))

export const DriverUpdateSchema = DriverIdSchema.merge(
  DriverSchema.deepPartial(),
)
