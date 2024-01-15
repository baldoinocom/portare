import { DriverStatus, ExpirationType } from '@prisma/client'
import { z } from 'zod'

export const AbsentDriverIdSchema = z.object({
  id: z.number().int().positive(),

  driverId: z.number().int().positive(),
})

export const AbsentDriverSchema = z.object({
  driverId: z
    .number({ required_error: 'O motorista é obrigatório' })
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
).refine(({ startedAt, expirationType }) => !startedAt === !expirationType, {
  message:
    'É necessário informar a data de início e o tipo de expiração para atualizar',
})
