import { RelationshipTypeEnum } from '@/lib/enums'
import { extractNumber } from '@/lib/utils'
import { validCPF } from '@/lib/validators'
import { z } from 'zod'

export const PersonIdSchema = z.object({
  id: z.number().int().positive(),
})

const PersonSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório' })
    .trim()
    .toUpperCase()
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    .max(255, { message: 'O nome não pode ter mais de 255 caracteres' }),

  nickname: z.optional(
    z
      .string()
      .trim()
      .toUpperCase()
      .max(50, { message: 'O apelido não pode ter mais de 50 caracteres' }),
  ),

  cpf: z.optional(
    z
      .string()
      .trim()
      .transform(extractNumber)
      .refine(({ length }) => !length || length === 11, {
        message: 'O CPF deve ter exatamente 11 dígitos',
      })
      .refine((value) => validCPF(value), { message: 'O CPF deve ser válido' }),
  ),

  phoneNumber: z.optional(
    z
      .string()
      .trim()
      .transform(extractNumber)
      .refine(({ length }) => !length || length === 11, {
        message: 'O número de telefone deve ter exatamente 11 dígitos',
      }),
  ),

  unitId: z.optional(
    z.number({ required_error: 'A unidade é obrigatória' }).int().positive(),
  ),

  aggregateId: z.optional(
    z.number({ required_error: 'O aggregado é obrigatório' }).int().positive(),
  ),
})

const PersonUpdateSchema = PersonIdSchema.merge(PersonSchema.deepPartial())

export const PersonWithoutRelationshipSchema = PersonSchema.omit({
  unitId: true,
  aggregateId: true,
})

export const PersonWithUniqueRelationshipSchema = PersonSchema.refine(
  ({ unitId, aggregateId }) => !unitId !== !aggregateId,
  {
    message: 'Apenas um entre unidade e agregado deve estar presente',
  },
)

export const PersonWithNullableRelationshipSchema = PersonUpdateSchema.refine(
  ({ unitId, aggregateId }) => !(unitId && aggregateId),
  {
    message: 'Apenas um entre unidade e agregado deve estar presente',
  },
)

export const PersonWithRelationshipTypeSchema = z
  .discriminatedUnion(
    'relationshipType',
    [
      z
        .object({
          relationshipType: z.literal(RelationshipTypeEnum.unit),
        })
        .merge(PersonSchema.pick({ unitId: true }).required()),

      z
        .object({
          relationshipType: z.literal(RelationshipTypeEnum.aggregate),
        })
        .merge(PersonSchema.pick({ aggregateId: true }).required()),
    ],
    { required_error: 'O tipo de vínculo é obrigatório' },
  )
  .and(PersonWithoutRelationshipSchema)
