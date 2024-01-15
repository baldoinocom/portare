import { ExpirationType } from '@prisma/client'
import { z } from 'zod'

export const ASOIdSchema = z.object({
  id: z.number().int().positive(),

  driverId: z.number().int().positive(),
})

export const ASOSchema = z.object({
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
})

export const ASOUpdateSchema = ASOIdSchema.merge(
  ASOSchema.omit({ driverId: true }).deepPartial(),
).refine(({ startedAt, expirationType }) => !startedAt === !expirationType, {
  message:
    'É necessário informar a data de início e o tipo de expiração para atualizar',
})
