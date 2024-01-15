import { z } from 'zod'

export const TicketIdSchema = z.object({
  id: z.number().int().positive(),
})
