import { VehicleSchema } from '@/actions/vehicle/schema'
import { z } from 'zod'

export const TrailerIdSchema = z.object({
  id: z.number().int().positive(),
})

export const TrailerSchema = z.object({
  vehicle: VehicleSchema.pick({ licensePlate: true, renavam: true }),

  fleetNumber: z.optional(
    z
      .string({
        invalid_type_error: 'O número da frota deve conter apenas dígitos',
      })
      .max(4, {
        message: 'O número da frota não pode ter mais de 4 caracteres',
      }),
  ),
})

export const TrailerExistingSchema = TrailerIdSchema.partial().extend({
  trailers: z
    .array(TrailerSchema)
    .nonempty({ message: 'Pelo menos um reboque é obrigatório' }),
})
