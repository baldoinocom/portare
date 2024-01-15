import { ExpirationType } from '@prisma/client'
import { z } from 'zod'

export const TrailerCertificateIdSchema = z.object({
  id: z.number().int().positive(),

  trailerId: z.number().int().positive(),
})

export const TrailerCertificateSchema = z.object({
  trailerId: z
    .number({ required_error: 'O reboque é obrigatório' })
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

export const TrailerCertificateUpdateSchema = TrailerCertificateIdSchema.merge(
  TrailerCertificateSchema.omit({ trailerId: true }).deepPartial(),
).refine(({ startedAt, expirationType }) => !startedAt === !expirationType, {
  message:
    'É necessário informar a data de início e o tipo de expiração para atualizar',
})
