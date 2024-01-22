import { RelationshipTypeEnum } from '@/lib/enums'
import { extractNumber } from '@/lib/utils'
import { validChassis, validLicensePlate, validRenavam } from '@/lib/validators'
import { z } from 'zod'

export const VehicleIdSchema = z.object({
  id: z.number().int().positive(),
})

export const VehicleSchema = z.object({
  licensePlate: z
    .string({ required_error: 'A placa é obrigatória' })
    .trim()
    .toUpperCase()
    .min(7, { message: 'A placa deve ter no mínimo 7 caracteres' })
    .max(8, { message: 'A placa não pode ter mais de 8 caracteres' })
    .refine(validLicensePlate, {
      message: 'A placa deve estar no formato antigo ou no formato novo',
    }),

  model: z.optional(
    z
      .string()
      .trim()
      .toUpperCase()
      .max(255, { message: 'O modelo não pode ter mais de 255 caracteres' }),
  ),

  year: z.optional(
    z
      .string()
      .trim()
      .refine(({ length }) => !length || length === 4, {
        message: 'O ano deve ter exatamente 4 dígitos',
      }),
  ),

  axle: z.optional(
    z.coerce
      .number()
      .int()
      .refine(({ toString: { length } }) => !length || length === 1, {
        message: 'O número deve ter no mínimo 1 e no máximo 9 eixos',
      }),
  ),

  chassis: z.optional(
    z
      .string()
      .trim()
      .toUpperCase()
      .transform((value) => value?.replace(/\s/g, ''))
      .refine(({ length }) => !length || length === 17, {
        message: 'O chassi deve ter exatamente 17 caracteres',
      })
      .refine((value) => validChassis(value), {
        message: 'O chassi deve ser válido',
      }),
  ),

  renavam: z.optional(
    z
      .string()
      .trim()
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

  unitId: z.optional(
    z.number({ required_error: 'A unidade é obrigatória' }).int().positive(),
  ),

  aggregateId: z.optional(
    z.number({ required_error: 'O agregado é obrigatório' }).int().positive(),
  ),
})

const VehicleUpdateSchema = VehicleIdSchema.merge(VehicleSchema.deepPartial())

export const VehicleWithoutRelationshipSchema = VehicleSchema.omit({
  unitId: true,
  aggregateId: true,
})

export const VehicleWithUniqueRelationshipSchema = VehicleSchema.refine(
  ({ unitId, aggregateId }) => !unitId !== !aggregateId,
  {
    message: 'Apenas um entre unidade e agregado deve estar presente',
  },
)

export const VehicleWithNullableRelationshipSchema = VehicleUpdateSchema.refine(
  ({ unitId, aggregateId }) => !(unitId && aggregateId),
  {
    message: 'Apenas um entre unidade e agregado deve estar presente',
  },
)

export const VehicleWithRelationshipTypeSchema = z
  .discriminatedUnion(
    'relationshipType',
    [
      z
        .object({
          relationshipType: z.literal(RelationshipTypeEnum.unit),
        })
        .merge(VehicleSchema.pick({ unitId: true }).required()),

      z
        .object({
          relationshipType: z.literal(RelationshipTypeEnum.aggregate),
        })
        .merge(VehicleSchema.pick({ aggregateId: true }).required()),
    ],
    { required_error: 'O tipo de vínculo é obrigatório' },
  )
  .and(VehicleSchema.omit({ unitId: true, aggregateId: true }))
