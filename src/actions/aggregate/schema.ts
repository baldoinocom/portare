import { CompanySchema } from '@/actions/company/schema'
import { PersonWithoutRelationshipSchema } from '@/actions/person/schema'
import { DocumentTypeEnum } from '@/lib/enums'
import { z } from 'zod'

export const AggregateIdSchema = z.object({
  id: z.number().int().positive(),
})

const AggregateSchema = z.object({
  person: z.optional(PersonWithoutRelationshipSchema),

  company: z.optional(CompanySchema),

  fleetId: z
    .number({ required_error: 'A unidade é obrigatória' })
    .int()
    .positive(),
})

const AggregateUpdateSchema = AggregateIdSchema.merge(
  AggregateSchema.deepPartial(),
)

export const AggregateWithUniqueDocumentSchema = AggregateSchema.refine(
  ({ company, person }) => !company !== !person,
  {
    message: 'Apenas um entre empresa e pessoa deve estar presente',
  },
)

export const AggregateWithNullableDocumentSchema = AggregateUpdateSchema.refine(
  ({ company, person }) => !(company && person),
  {
    message: 'Apenas um entre empresa e pessoa deve estar presente',
  },
)

export const AggregateWithDocumentTypeSchema = z
  .discriminatedUnion(
    'documentType',
    [
      z
        .object({
          documentType: z.literal(DocumentTypeEnum.cpf),
        })
        .merge(AggregateSchema.pick({ person: true }).required()),

      z
        .object({
          documentType: z.literal(DocumentTypeEnum.cnpj),
        })
        .merge(AggregateSchema.pick({ company: true }).required()),
    ],
    { required_error: 'O tipo de documento é obrigatório' },
  )
  .and(AggregateSchema.omit({ person: true, company: true }))
