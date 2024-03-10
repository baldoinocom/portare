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

  compressor: z.optional(z.boolean().default(false)),

  compressorModel: z.optional(
    z.string().trim().toUpperCase().max(255, {
      message: 'O modelo do compressor não pode ter mais de 255 caracteres',
    }),
  ),
})

export const TruckWithRelationshipTypeSchema = TruckSchema.pick({
  compressor: true,
  compressorModel: true,
}).merge(z.object({ vehicle: VehicleWithRelationshipTypeSchema }))

export const TruckUpdateSchema = TruckIdSchema.merge(TruckSchema.deepPartial())

export const TruckImportSchema = z.object({
  Unidade: z.coerce.string().nullish(),
  Agregado: z.coerce.string().nullish(),

  Placa: z.coerce.string().nullish(),
  Marca: z.coerce.string().nullish(),
  Modelo: z.coerce.string().nullish(),
  Ano: z.coerce.string().nullish(),
  Eixos: z.coerce.string().nullish(),
  Chassi: z.coerce.string().nullish(),
  Renavam: z.coerce.string().nullish(),

  'Compressor - Modelo': z.coerce.string().nullish(),
})
