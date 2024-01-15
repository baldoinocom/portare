import { z } from 'zod'

export const GroupingIdSchema = z.object({
  id: z.number().int().positive(),
})
