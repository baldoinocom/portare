import { z } from 'zod'

export const TrailerConfigurationIdSchema = z.object({
  id: z.number().int().positive(),
})

export const TrailerConfigurationSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório' })
    .min(1, { message: 'O nome deve ter no mínimo 1 caracteres' })
    .max(255, { message: 'O nome não pode ter mais de 255 caracteres' })
    .toUpperCase(),

  numberOfTrailers: z.coerce
    .number({
      required_error: 'O número de reboques é obrigatório',
    })
    .int()
    .min(1, { message: 'O número de reboques deve ter no mínimo 1' })
    .max(4, { message: 'O número de reboques deve ter no máximo 4' }),
})

export const TrailerConfigurationUpdateSchema =
  TrailerConfigurationIdSchema.merge(TrailerConfigurationSchema.deepPartial())
