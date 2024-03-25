import { z } from 'zod'

export const PermissionSchema = z.object({
  group: z.string(),

  code: z.string(),

  guard: z.string(),
})
