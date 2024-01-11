import { RelationshipTypeEnum } from '@/lib/enums'
import { extractNumber } from '@/lib/utils'
import { validLicensePlate, validRenavam } from '@/lib/validators'
import { z } from 'zod'

export const VehicleIdSchema = z.object({
  id: z.number().int().positive(),
})

export const VehicleSchema = z.object({
  licensePlate: z
    .string({ required_error: 'A placa é obrigatória' })
    .min(7, { message: 'A placa deve ter no mínimo 7 caracteres' })
    .max(8, { message: 'A placa não pode ter mais de 8 caracteres' })
    .toUpperCase()
    .refine(validLicensePlate, {
      message:
        'A placa deve estar no formato antigo (ABC-1234) ou no formato novo (ABC1D23)',
    }),

  model: z.optional(
    z
      .string()
      .max(255, { message: 'O modelo não pode ter mais de 255 caracteres' })
      .toUpperCase(),
  ),

  renavam: z.optional(
    z
      .string()
      .transform(extractNumber)
      .refine(({ length }) => !length || length === 11, {
        message: 'O RENAVAM deve ter exatamente 11 dígitos',
      })
      .refine((value) => validRenavam(value), {
        message: 'O RENAVAM deve ser válido',
      }),
  ),

  brandId: z
    .number({ required_error: 'A marca é obrigatória' })
    .int()
    .positive(),

  fleetId: z.optional(
    z.number({ required_error: 'O vínculo é obrigatório' }).int().positive(),
  ),

  aggregateId: z.optional(
    z.number({ required_error: 'O vínculo é obrigatório' }).int().positive(),
  ),
})

const VehicleUpdateSchema = VehicleIdSchema.merge(VehicleSchema.deepPartial())

export const VehicleWithoutRelationshipSchema = VehicleSchema.omit({
  fleetId: true,
  aggregateId: true,
})

export const VehicleWithUniqueRelationshipSchema = VehicleSchema.refine(
  ({ fleetId, aggregateId }) => !fleetId !== !aggregateId,
  {
    message: 'Apenas um entre frota e agregado deve estar presente',
  },
)

export const VehicleWithNullableRelationshipSchema = VehicleUpdateSchema.refine(
  ({ fleetId, aggregateId }) => !(fleetId && aggregateId),
  {
    message: 'Apenas um entre frota e agregado deve estar presente',
  },
)

export const VehicleWithRelationshipTypeSchema = z
  .discriminatedUnion(
    'relationshipType',
    [
      z
        .object({
          relationshipType: z.literal(RelationshipTypeEnum.fleet),
        })
        .merge(VehicleSchema.pick({ fleetId: true }).required()),

      z
        .object({
          relationshipType: z.literal(RelationshipTypeEnum.aggregate),
        })
        .merge(VehicleSchema.pick({ aggregateId: true }).required()),
    ],
    { required_error: 'O tipo de vínculo é obrigatório' },
  )
  .and(VehicleSchema.omit({ fleetId: true, aggregateId: true }))
