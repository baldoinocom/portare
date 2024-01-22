import { VehicleStatus } from '@prisma/client'
import { z } from 'zod'

export const StoppedVehicleIdSchema = z.object({
  id: z.number().int().positive(),

  vehicleId: z.number().int().positive(),
})

const StoppedVehicleSchema = z.object({
  vehicleId: z
    .number({ required_error: 'O veículo é obrigatório' })
    .int()
    .positive(),

  startedAt: z.coerce.date({
    invalid_type_error: 'A data de início é inválida',
    required_error: 'A data de início é obrigatória',
  }),

  endedAt: z.coerce.date({
    invalid_type_error: 'A data de fim é inválida',
    required_error: 'A data de fim é obrigatória',
  }),

  status: z.nativeEnum(VehicleStatus, {
    invalid_type_error: 'O status do veículo é inválido',
    required_error: 'O status do veículo é obrigatório',
  }),

  note: z.optional(
    z.string().trim().max(255, {
      message: 'A observação não pode ter mais de 255 caracteres',
    }),
  ),
})

export const StoppedVehicleUpdateSchema = StoppedVehicleIdSchema.merge(
  StoppedVehicleSchema.omit({ vehicleId: true }).deepPartial(),
)
  .refine(({ startedAt, endedAt }) => !startedAt === !endedAt, {
    path: ['startedAt'],
    message: 'É necessário informar a data de início e de fim para atualizar',
  })
  .refine(
    ({ startedAt, endedAt }) =>
      startedAt && endedAt ? startedAt <= endedAt : true,
    {
      path: ['startedAt'],
      message: 'A data de início deve ser anterior à data de fim',
    },
  )

export const StoppedVehicleWithDateRangeSchema = StoppedVehicleSchema.refine(
  ({ startedAt, endedAt }) => startedAt && endedAt,
  {
    path: ['startedAt'],
    message: 'A data de início e de fim são obrigatórias',
  },
).refine(({ startedAt, endedAt }) => startedAt <= endedAt, {
  path: ['startedAt'],
  message: 'A data de início deve ser anterior à data de fim',
})
