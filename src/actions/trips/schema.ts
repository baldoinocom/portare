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

  departedAt: z.coerce.date({
    invalid_type_error: 'A data de partida é inválida',
    required_error: 'A data de partida é obrigatória',
  }),

  arrivedAt: z.coerce.date({
    invalid_type_error: 'A data de chegada é inválida',
    required_error: 'A data de chegada é obrigatória',
  }),

  status: z.nativeEnum(TripStatus, {
    invalid_type_error: 'O status é inválido',
    required_error: 'O status é obrigatório',
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

export const TripUpdateSchema = TripIdSchema.merge(TripSchema.deepPartial())
