import {
  VehicleWithRelationshipTypeSchema,
  VehicleWithUniqueRelationshipSchema,
} from '@/actions/vehicle/schema'
import { z } from 'zod'

export const TruckIdSchema = z.object({
  id: z.number().int().positive(),
})

export const TruckSchema = z.object({
  vehicle: VehicleWithUniqueRelationshipSchema,
})

export const TruckWithRelationshipTypeSchema = z.object({
  vehicle: VehicleWithRelationshipTypeSchema,
})

export const TruckUpdateSchema = TruckIdSchema.merge(TruckSchema.deepPartial())
