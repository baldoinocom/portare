import { TripSteps } from '@/lib/enums'
import { TripStatus } from '@prisma/client'
import { z } from 'zod'

export const TripIdSchema = z.object({
  id: z.string().cuid(),
})

export const TripSchema = z.object({
  order: z.optional(
    z
      .string()
      .trim()
      .max(255, { message: 'A ordem não pode ter mais de 255 caracteres' }),
  ),

  note: z.optional(
    z.string().trim().max(255, {
      message: 'A observação não pode ter mais de 255 caracteres',
    }),
  ),

  status: z.nativeEnum(TripStatus, {
    invalid_type_error: 'O status é inválido',
    required_error: 'O status é obrigatório',
  }),

  departedAt: z.coerce.date({
    invalid_type_error: 'A data de partida é inválida',
    required_error: 'A data de partida é obrigatória',
  }),

  arrivedAt: z.coerce.date({
    invalid_type_error: 'A data de chegada é inválida',
    required_error: 'A data de chegada é obrigatória',
  }),

  originId: z
    .number({ required_error: 'A origem é obrigatória' })
    .int()
    .positive(),

  destinationId: z
    .number({ required_error: 'O destino é obrigatório' })
    .int()
    .positive(),

  driverId: z
    .number({ required_error: 'O motorista é obrigatório' })
    .int()
    .positive(),

  truckId: z
    .number({ required_error: 'O caminhão é obrigatório' })
    .int()
    .positive(),

  semiTrailerId: z
    .number({ required_error: 'O semirreboque é obrigatório' })
    .int()
    .positive(),

  cargoId: z
    .number({ required_error: 'A carga é obrigatória' })
    .int()
    .positive(),
})

export const TripUpdateSchema = TripIdSchema.merge(
  TripSchema.deepPartial(),
).refine(({ departedAt, arrivedAt }) => !departedAt === !arrivedAt, {
  path: ['departedAt'],
  message:
    'É necessário informar a data de partida e de chegada para atualizar',
})

export const TripWithDraftSchema = TripSchema.partial({
  driverId: true,
  truckId: true,
  semiTrailerId: true,
  cargoId: true,
})

export const TripWithStepSchema = z
  .discriminatedUnion('step', [
    z.object({ step: z.literal(TripSteps.one) }).merge(
      TripSchema.omit({
        driverId: true,
        truckId: true,
        semiTrailerId: true,
        cargoId: true,
      }),
    ),

    z.object({ step: z.literal(TripSteps.two) }).merge(TripSchema),
    z.object({ step: z.literal(TripSteps.three) }).merge(TripSchema),

    z.object({ step: z.literal(TripSteps.four) }).merge(TripWithDraftSchema),
    z.object({ step: z.literal(TripSteps.five) }).merge(TripWithDraftSchema),
  ])
  .and(
    z.object({
      groupingId: z.number().int().positive().nullish(),
    }),
  )
