import { z } from 'zod'

export const PermissionCheckSchema = z.object({
  permission: z.string(),

  guard: z.string(),
})
