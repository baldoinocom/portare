'use client'

import { action } from '@/actions'
import { AggregateWithDocumentTypeSchema } from '@/actions/aggregate/schema'
import { Aggregate, Fleet } from '@/actions/types'
import { CompanyInformation } from '@/components/forms/fields/company-information'
import { PersonalInformation } from '@/components/forms/fields/personal-information'
import { DocumentTypeCard } from '@/components/forms/ui/document-type-card'
import { FleetSelect } from '@/components/forms/ui/fleet-select'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { DocumentTypeEnum } from '@/lib/enums'
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const AggregateForm = ({
  initialData,
  fleets,
}: {
  initialData?: Aggregate
  fleets?: Fleet[]
}) => {
  const router = useRouter()

  const { toast } = useToast()

  const form = useForm<z.infer<typeof AggregateWithDocumentTypeSchema>>({
    resolver: zodResolver(AggregateWithDocumentTypeSchema),
    defaultValues: {
      ...nullAsUndefined(initialData),
      documentType: initialData?.companyId
        ? DocumentTypeEnum.cnpj
        : DocumentTypeEnum.cpf,
    },
  })

  const { execute } = useAction(action.aggregate.create, {
    onSuccess: (data) => {
      router.replace(String(data.id))
      toast({
        title: 'Agregado cadastrado com sucesso',
        description: 'O agregado foi cadastrado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar o agregado',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(action.aggregate.update, {
    onSuccess: () => {
      toast({
        title: 'Cliente atualizado com sucesso',
        description: 'O cliente foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o cliente',
        description: error,
      })
    },
  })

  const onSubmit = async (
    values: z.infer<typeof AggregateWithDocumentTypeSchema>,
  ) => {
    if (initialData) {
      await executeUpdate({ id: initialData.id, ...values })
    } else {
      await execute(values)
    }
  }

  const [documentType, setDocumentType] = React.useState<DocumentTypeEnum>(
    form.formState.defaultValues?.documentType || DocumentTypeEnum.cpf,
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <FormSession>
            <div>
              <h2 className="text-base font-semibold">
                Informações do agregado
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe se o agregado é uma pessoa física ou jurídica
              </p>
            </div>

            <FormFields>
              <div className="sm:col-span-full">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <RadioGroup
                        {...field}
                        onValueChange={(e: DocumentTypeEnum) => {
                          setDocumentType(e)
                          field.onChange(e)
                        }}
                        className="space-y-8"
                      >
                        <DocumentTypeCard value={DocumentTypeEnum.cpf}>
                          <div>
                            <h2 className="text-base font-semibold">
                              Pessoa física
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Informe o CPF e os dados pessoais do agregado
                            </p>
                          </div>
                        </DocumentTypeCard>

                        <DocumentTypeCard value={DocumentTypeEnum.cnpj}>
                          <div>
                            <h2 className="text-base font-semibold">
                              Pessoa jurídica
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Informe o CNPJ e os dados da empresa e do
                              proprietário
                            </p>
                          </div>
                        </DocumentTypeCard>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormFields>
          </FormSession>

          <Separator />

          {documentType === DocumentTypeEnum.cpf && (
            <FormSession>
              <div>
                <h2 className="text-base font-semibold">
                  Informações pessoais
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gerenciar configurações de informações pessoais
                </p>
              </div>

              <FormFields>
                <PersonalInformation />
              </FormFields>
            </FormSession>
          )}

          {documentType === DocumentTypeEnum.cnpj && (
            <FormSession>
              <div>
                <h2 className="text-base font-semibold">
                  Informações da empresa
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Gerenciar configurações de informações da empresa
                </p>
              </div>

              <FormFields>
                <CompanyInformation />
              </FormFields>
            </FormSession>
          )}

          <Separator />

          <FormSession>
            <div>
              <h2 className="text-base font-semibold">Unidade</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Define a unidade do agregado
              </p>
            </div>

            <FormFields>
              <div className="sm:col-span-4">
                <FormField
                  control={form.control}
                  name="fleetId"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Unidade</FormLabel>
                      <FleetSelect fleets={fleets} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormFields>
          </FormSession>

          {initialData && form.formState.isDirty && (
            <>
              <Separator />

              <FormAlert />

              <div className="flex items-center justify-end space-x-6">
                <Button
                  variant="ghost"
                  disabled={form.formState.isSubmitting}
                  onClick={() => form.reset()}
                >
                  Descartar
                </Button>
                <Button disabled={form.formState.isSubmitting}>
                  Salvar alterações
                </Button>
              </div>
            </>
          )}

          {!initialData && (
            <>
              <Separator />

              <FormAlert />

              <div className="flex items-center justify-end space-x-6">
                <Button disabled={form.formState.isSubmitting}>Salvar</Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
