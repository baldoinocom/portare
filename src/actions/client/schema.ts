import { CompanySchema } from '@/actions/company/schema'
import { ClientType } from '@prisma/client'
import { z } from 'zod'

export const ClientIdSchema = z.object({
  companyId: z.number().int().positive(),
})

export const ClientSchema = z.object({
  company: CompanySchema,

  type: z.nativeEnum(ClientType, {
    invalid_type_error: 'O tipo de cliente é inválido',
    required_error: 'O tipo de cliente é obrigatório',
  }),
})

export const ClientUpdateSchema = ClientIdSchema.merge(
  ClientSchema.deepPartial(),
)
