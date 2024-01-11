import { z } from 'zod'

export const TrailerConfigurationIdSchema = z.object({
  id: z.number().int().positive(),
})
