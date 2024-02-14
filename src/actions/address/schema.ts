import { extractNumber } from '@/lib/utils'
import { validCEP } from '@/lib/validators'
import { z } from 'zod'

export const AddressIdSchema = z.object({
  id: z.number().int().positive(),
})

export const AddressSchema = z.object({
  zipCode: z.optional(
    z
      .string()
      .trim()
      .transform(extractNumber)
      .refine(({ length }) => !length || length === 8, {
        message: 'O CEP deve ter exatamente 8 caracteres',
      })
      .refine((value) => validCEP(value), { message: 'O CEP deve ser válido' }),
  ),

  state: z.optional(
    z
      .string()
      .trim()
      .toUpperCase()
      .max(255, { message: 'O estado não pode ter mais de 255 caracteres' }),
  ),

  city: z.optional(
    z
      .string()
      .trim()
      .toUpperCase()
      .max(255, { message: 'A cidade não pode ter mais de 255 caracteres' }),
  ),

  locale: z.optional(
    z
      .string()
      .trim()
      .toUpperCase()
      .max(255, { message: 'O endereço não pode ter mais de 255 caracteres' }),
  ),
})

export const AddressUpdateSchema = AddressIdSchema.merge(
  AddressSchema.deepPartial(),
)
