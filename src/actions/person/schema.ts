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
    .min(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    .max(255, { message: 'O nome não pode ter mais de 255 caracteres' })
    .toUpperCase(),

  nickname: z.optional(
    z
      .string()
      .max(50, { message: 'O apelido não pode ter mais de 50 caracteres' })
      .toUpperCase(),
  ),

  cpf: z.optional(
    z
      .string()
      .transform(extractNumber)
      .refine(({ length }) => !length || length === 11, {
        message: 'O CPF deve ter exatamente 11 dígitos',
      })
      .refine((value) => validCPF(value), { message: 'O CPF deve ser válido' }),
  ),

  phoneNumber: z.optional(
    z
      .string()
      .transform(extractNumber)
      .refine(({ length }) => !length || length === 11, {
        message: 'O número de telefone deve ter exatamente 11 dígitos',
      }),
  ),

  fleetId: z.optional(
    z.number({ required_error: 'O vínculo é obrigatório' }).int().positive(),
  ),

  aggregateId: z.optional(
    z.number({ required_error: 'O vínculo é obrigatório' }).int().positive(),
  ),
})

const PersonUpdateSchema = PersonIdSchema.merge(PersonSchema.deepPartial())

export const PersonWithoutRelationshipSchema = PersonSchema.omit({
  fleetId: true,
  aggregateId: true,
})

export const PersonWithUniqueRelationshipSchema = PersonSchema.refine(
  ({ fleetId, aggregateId }) => !fleetId !== !aggregateId,
  {
    message: 'Apenas um entre frota e agregado deve estar presente',
  },
)

export const PersonWithNullableRelationshipSchema = PersonUpdateSchema.refine(
  ({ fleetId, aggregateId }) => !(fleetId && aggregateId),
  {
    message: 'Apenas um entre frota e agregado deve estar presente',
  },
)

export const PersonWithRelationshipTypeSchema = z
  .discriminatedUnion(
    'relationshipType',
    [
      z
        .object({
          relationshipType: z.literal(RelationshipTypeEnum.fleet),
        })
        .merge(PersonSchema.pick({ fleetId: true }).required()),

      z
        .object({
          relationshipType: z.literal(RelationshipTypeEnum.aggregate),
        })
        .merge(PersonSchema.pick({ aggregateId: true }).required()),
    ],
    { required_error: 'O tipo de vínculo é obrigatório' },
  )
  .and(PersonWithoutRelationshipSchema)
