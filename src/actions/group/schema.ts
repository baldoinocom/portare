import { z } from 'zod'

export const GroupIdSchema = z.object({
  id: z.number().int().positive(),
})

export const GroupSchema = z.object({
  name: z
    .string({ required_error: 'O nome é obrigatório' })
    .trim()
    .toUpperCase()
    .min(1, { message: 'O nome deve ter no mínimo 1 caracteres' })
    .max(255, { message: 'O nome não pode ter mais de 255 caracteres' }),

  roles: z
    .array(z.object({ id: z.number().int().positive() }), {
      required_error: 'Pelo menos um cargo é obrigatório',
    })
    .nonempty({ message: 'Pelo menos um cargo é obrigatório' }),
})

export const GroupUpdateSchema = GroupIdSchema.merge(GroupSchema.deepPartial())
