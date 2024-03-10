import { TrailerSchema } from '@/actions/trailer/schema'
import { findRepeatedStrings } from '@/lib/utils'
import { z } from 'zod'
import { VehicleSchema } from '../vehicle/schema'

export const SemiTrailerIdSchema = z.object({
  id: z.number().int().positive(),
})

export const SemiTrailerSchema = VehicleSchema.pick({
  model: true,
  year: true,
  axle: true,
}).merge(
  z.object({
    brandId: z
      .number({ required_error: 'A marca é obrigatória' })
      .int()
      .positive(),

    unitId: z
      .number({ required_error: 'A unidade é obrigatória' })
      .int()
      .positive(),

    configurationId: z
      .number({ required_error: 'A configuração de reboque é obrigatória' })
      .int()
      .positive(),

    typeId: z
      .number({ required_error: 'O tipo de reboque é obrigatório' })
      .int()
      .positive(),

    cargos: z
      .array(z.object({ id: z.number().int().positive() }), {
        required_error: 'Pelo menos um tipo de carga é obrigatório',
      })
      .nonempty({ message: 'Pelo menos um tipo de carga é obrigatório' }),

    trailers: z
      .array(TrailerSchema, {
        required_error: 'Pelo menos um reboque é obrigatório',
      })
      .nonempty({ message: 'Pelo menos um reboque é obrigatório' })
      .superRefine((val, ctx) => {
        const licensePlates = findRepeatedStrings(
          val.map(({ vehicle: { licensePlate } }) => licensePlate),
        )

        if (licensePlates.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `As placas (${licensePlates.join(
              ', ',
            )}) estão sendo utilizadas em mais de um reboque`,
          })
        }
      })
      .superRefine((val, ctx) => {
        const chassis = findRepeatedStrings(
          val.map(({ vehicle: { chassis } }) => chassis),
        )

        if (chassis.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Os chassis (${chassis.join(
              ', ',
            )}) estão sendo utilizados em mais de um reboque`,
          })
        }
      })
      .superRefine((val, ctx) => {
        const RENAVAMs = findRepeatedStrings(
          val.map(({ vehicle: { renavam } }) => renavam),
        )

        if (RENAVAMs.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Os RENAVAMs (${RENAVAMs.join(
              ', ',
            )}) estão sendo utilizados em mais de um reboque`,
          })
        }
      })
      .superRefine((val, ctx) => {
        const fleetNumbers = findRepeatedStrings(
          val.map(({ fleetNumber }) => fleetNumber),
        )

        if (fleetNumbers.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Os números de frota (${fleetNumbers.join(
              ', ',
            )}) estão sendo utilizados em mais de um reboque`,
          })
        }
      }),
  }),
)

export const SemiTrailerUpdateSchema = SemiTrailerIdSchema.merge(
  SemiTrailerSchema.deepPartial(),
).refine(
  ({ configurationId, trailers }) => !configurationId === !trailers?.length,
  {
    message:
      'É necessário informar os reboques e a configuração do semirreboque para atualizar',
  },
)

export const SemiTrailerImportSchema = z.object({
  Unidade: z.coerce.string().nullish(),

  Marca: z.coerce.string().nullish(),
  Modelo: z.coerce.string().nullish(),
  Ano: z.coerce.string().nullish(),
  Tipo: z.coerce.string().nullish(),
  Cargas: z.coerce.string().nullish(),
  Configuração: z.coerce.string().nullish(),
  Eixos: z.coerce.string().nullish(),

  Placa: z.coerce.string().nullish(),
  Chassi: z.coerce.string().nullish(),
  Renavam: z.coerce.string().nullish(),
  'Nº de frota': z.coerce.string().nullish(),

  '2-Placa': z.coerce.string().nullish(),
  '2-Chassi': z.coerce.string().nullish(),
  '2-Renavam': z.coerce.string().nullish(),
  '2-Nº de frota': z.coerce.string().nullish(),

  '3-Placa': z.coerce.string().nullish(),
  '3-Chassi': z.coerce.string().nullish(),
  '3-Renavam': z.coerce.string().nullish(),
  '3-Nº de frota': z.coerce.string().nullish(),

  '4-Placa': z.coerce.string().nullish(),
  '4-Chassi': z.coerce.string().nullish(),
  '4-Renavam': z.coerce.string().nullish(),
  '4-Nº de frota': z.coerce.string().nullish(),
})
