import { z } from 'zod'

export const CargoIdSchema = z.object({
  id: z.number().int().positive(),
})
