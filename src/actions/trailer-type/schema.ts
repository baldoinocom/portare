import { z } from 'zod'

export const TrailerTypeIdSchema = z.object({
  id: z.number().int().positive(),
})
