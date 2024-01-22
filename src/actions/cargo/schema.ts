import { z } from 'zod'

export const CargoIdSchema = z.object({
  id: z.number().int().positive(),
})

export const CargoSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório' })
    .trim()
    .toUpperCase()
    .min(1, { message: 'O nome deve ter no mínimo 1 caracteres' })
    .max(255, { message: 'O nome não pode ter mais de 255 caracteres' }),
})

export const CargoUpdateSchema = CargoIdSchema.merge(CargoSchema.deepPartial())
