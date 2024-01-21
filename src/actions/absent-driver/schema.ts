import { DriverStatus } from '@prisma/client'
import { z } from 'zod'

export const AbsentDriverIdSchema = z.object({
  id: z.number().int().positive(),

  driverId: z.number().int().positive(),
})

const AbsentDriverSchema = z.object({
  driverId: z
    .number({ required_error: 'O motorista é obrigatório' })
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

  status: z.nativeEnum(DriverStatus, {
    invalid_type_error: 'O status do motorista é inválido',
    required_error: 'O status do motorista é obrigatório',
  }),

  note: z.optional(
    z
      .string()
      .max(255, { message: 'A observação não pode ter mais de 255 caracteres' })
      .toUpperCase(),
  ),
})

export const AbsentDriverUpdateSchema = AbsentDriverIdSchema.merge(
  AbsentDriverSchema.omit({ driverId: true }).deepPartial(),
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

export const AbsentDriverWithDateRangeSchema = AbsentDriverSchema.refine(
  ({ startedAt, endedAt }) => startedAt && endedAt,
  {
    path: ['startedAt'],
    message: 'A data de início e de fim são obrigatórias',
  },
).refine(({ startedAt, endedAt }) => startedAt <= endedAt, {
  path: ['startedAt'],
  message: 'A data de início deve ser anterior à data de fim',
})
