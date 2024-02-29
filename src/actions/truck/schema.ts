import {
  VehicleWithRelationshipTypeSchema,
  VehicleWithUniqueRelationshipSchema,
} from '@/actions/vehicle/schema'
import { emptyAsNull } from '@/lib/utils'
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

export const TruckImportSchema = z
  .object({
    Placa: z.string().trim().nullish().transform(emptyAsNull),
    Modelo: z.string().trim().nullish().transform(emptyAsNull),
    Ano: z.string().trim().nullish().transform(emptyAsNull),
    Eixo: z.string().trim().nullish().transform(emptyAsNull),
    Chassi: z.string().trim().nullish().transform(emptyAsNull),
    Renavam: z.string().trim().nullish().transform(emptyAsNull),
    Marca: z.string().trim().nullish().transform(emptyAsNull),
    Frota: z.string().trim().nullish().transform(emptyAsNull),
    Compressor: z.string().trim().nullish().transform(emptyAsNull),
  })
  .array()
