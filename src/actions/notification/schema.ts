import { z } from 'zod'

export const NotificationIdSchema = z.object({
  id: z.number().int().positive(),
})
