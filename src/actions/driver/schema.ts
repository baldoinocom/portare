import {
  PersonWithRelationshipTypeSchema,
  PersonWithUniqueRelationshipSchema,
} from '@/actions/person/schema'
import { extractNumber } from '@/lib/utils'
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
      .trim()
      .transform(extractNumber)
      .refine(({ length }) => !length || length === 11, {
        message: 'O CNH deve ter exatamente 11 dígitos',
      })
      .refine(validCNH, { message: 'O CNH deve ser válido' }),
  ),

  cnhMirror: z.optional(
    z
      .string()
      .trim()
      .refine(({ length }) => !length || length === 10, {
        message: 'O CNH espelho deve ter exatamente 10 dígitos',
      }),
  ),
})

export const DriverWithRelationshipTypeSchema = DriverSchema.pick({
  cnh: true,
  cnhMirror: true,
}).merge(z.object({ person: PersonWithRelationshipTypeSchema }))

export const DriverUpdateSchema = DriverIdSchema.merge(
  DriverSchema.deepPartial(),
)

export const DriverImportSchema = z.object({
  Unidade: z.coerce.string().nullish(),
  Agregado: z.coerce.string().nullish(),

  Nome: z.coerce.string().nullish(),
  Apelido: z.coerce.string().nullish(),
  CPF: z.coerce.string().nullish(),
  Telefone: z.coerce.string().nullish(),

  CNH: z.coerce.string().nullish(),
  'CNH espelho': z.coerce.string().nullish(),
})
