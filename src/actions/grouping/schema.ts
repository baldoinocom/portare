import { z } from 'zod'

export const GroupingIdSchema = z.object({
  id: z.number().int().positive(),
})

const GroupingSchema = z.object({
  driverId: z.coerce.number().int().positive().nullish(),

  truckId: z.coerce.number().int().positive().nullish(),

  semiTrailerId: z.coerce.number().int().positive().nullish(),
})

export const GroupingUpdateSchema = GroupingIdSchema.merge(
  GroupingSchema.deepPartial(),
)

export const GroupingWithUniqueSchema = GroupingSchema.refine(
  (data) => data.driverId || data.truckId || data.semiTrailerId,
  {
    message: 'Pelo menos um dos campos é obrigatório',
  },
)
