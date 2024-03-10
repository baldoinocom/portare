import { CompanyWithDocumentTypeSchema } from '@/actions/company/schema'
import { ClientType } from '@prisma/client'
import { z } from 'zod'

export const ClientIdSchema = z.object({
  companyId: z.number().int().positive(),
})

export const ClientSchema = z.object({
  company: CompanyWithDocumentTypeSchema,

  type: z.nativeEnum(ClientType, {
    invalid_type_error: 'O tipo de cliente é inválido',
    required_error: 'O tipo de cliente é obrigatório',
  }),
})

export const ClientUpdateSchema = ClientIdSchema.merge(
  ClientSchema.deepPartial(),
)

export const ClientImportSchema = z.object({
  'Tipo (Origem/Ambos/Destino)': z.coerce.string().nullish(),

  Nome: z.coerce.string().nullish(),
  'Nome fantasia': z.coerce.string().nullish(),
  CNPJ: z.coerce.string().nullish(),

  CEP: z.coerce.string().nullish(),
  Estado: z.coerce.string().nullish(),
  Cidade: z.coerce.string().nullish(),
  Endereço: z.coerce.string().nullish(),
})
