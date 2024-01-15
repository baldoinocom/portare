import { ExpirationType, VehicleStatus } from '@prisma/client'
import { z } from 'zod'

export const StoppedVehicleIdSchema = z.object({
  id: z.number().int().positive(),

  vehicleId: z.number().int().positive(),
})

export const StoppedVehicleSchema = z.object({
  vehicleId: z
    .number({ required_error: 'O veículo é obrigatório' })
    .int()
    .positive(),

  startedAt: z.coerce.date({
    invalid_type_error: 'A data de início é inválida',
    required_error: 'A data de início é obrigatória',
  }),

  expirationType: z.nativeEnum(ExpirationType, {
    invalid_type_error: 'O tipo de expiração é inválido',
    required_error: 'O tipo de expiração é obrigatório',
  }),

  status: z.nativeEnum(VehicleStatus, {
    invalid_type_error: 'O status do veículo é inválido',
    required_error: 'O status do veículo é obrigatório',
  }),

  note: z.optional(
    z.string().max(255, {
      message: 'A observação não pode ter mais de 255 caracteres',
    }),
  ),
})

export const StoppedVehicleUpdateSchema = StoppedVehicleIdSchema.merge(
  StoppedVehicleSchema.omit({ vehicleId: true }).deepPartial(),
).refine(({ startedAt, expirationType }) => !startedAt === !expirationType, {
  message:
    'É necessário informar a data de início e o tipo de expiração para atualizar',
})
