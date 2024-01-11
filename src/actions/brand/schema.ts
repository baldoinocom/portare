import { z } from 'zod'

export const BrandIdSchema = z.object({
  id: z.number().int().positive(),
})
