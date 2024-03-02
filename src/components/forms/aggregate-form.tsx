'use client'

import { action } from '@/actions'
import { AggregateSchema } from '@/actions/aggregate/schema'
import { AggregateResource, UnitResource } from '@/actions/types'
import { CompanyAddressInformation } from '@/components/forms/fields/address-information'
import { CompanyInformation } from '@/components/forms/fields/company-information'
import { DocumentTypeCard } from '@/components/forms/ui/document-type-card'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { UnitSelect } from '@/components/forms/ui/unit-select'
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
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { CompanyType } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const AggregateForm = ({
  initialData,
  units,
}: {
  initialData?: AggregateResource
  units?: UnitResource[]
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof AggregateSchema>>({
    resolver: zodResolver(AggregateSchema),
    defaultValues: nullAsUndefined(initialData) || {
      company: { type: CompanyType.cpf },
    },
  })

  const onReset = () => {
    form.reset({
      company: {
        name: '',
        tradeName: '',
        document: '',
        address: { zipCode: '', state: '', city: '', locale: '' },
      },
    })
  }

  const { create, update } = action.aggregate()

  const { execute } = useAction(create, {
    onSuccess: () => {
      onReset()

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

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Agregado atualizado com sucesso',
        description: 'O agregado foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o agregado',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof AggregateSchema>) => {
    if (initialData) {
      await executeUpdate({
        companyId: initialData.companyId,
        ...values,
      })
    } else {
      await execute(values)
    }
  }

  const [companyType, setCompanyType] = React.useState<CompanyType>(
    initialData?.company.type || CompanyType.cpf,
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
                <div className="flex flex-col">
                  <RadioGroup
                    value={companyType}
                    onValueChange={(e: CompanyType) => {
                      setCompanyType(e)
                      form.setValue('company.type', e, { shouldDirty: true })
                    }}
                    className="space-y-8"
                  >
                    <DocumentTypeCard value={CompanyType.cpf}>
                      <div>
                        <h2 className="text-base font-semibold">
                          Pessoa física
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Informe o CPF e os dados pessoais do agregado
                        </p>
                      </div>
                    </DocumentTypeCard>

                    <DocumentTypeCard value={CompanyType.cnpj}>
                      <div>
                        <h2 className="text-base font-semibold">
                          Pessoa jurídica
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Informe o CNPJ e os dados da empresa e do proprietário
                        </p>
                      </div>
                    </DocumentTypeCard>
                  </RadioGroup>
                  <FormMessage />
                </div>
              </div>
            </FormFields>
          </FormSession>

          <Separator />

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
              <CompanyInformation companyType={companyType} />
            </FormFields>
          </FormSession>

          <Separator />

          <FormSession>
            <div>
              <h2 className="text-base font-semibold">Endereço</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Informe o endereço da empresa
              </p>
            </div>

            <FormFields>
              <CompanyAddressInformation />
            </FormFields>
          </FormSession>

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
                  name="unitId"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Unidade</FormLabel>
                      <UnitSelect units={units} />
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
                  type="reset"
                  variant="ghost"
                  disabled={form.formState.isSubmitting}
                  onClick={() => form.reset()}
                >
                  Descartar
                </Button>

                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Loader2
                    className={cn(
                      'mr-2 size-4 animate-spin',
                      !form.formState.isSubmitting && 'sr-only',
                    )}
                  />
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
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Loader2
                    className={cn(
                      'mr-2 size-4 animate-spin',
                      !form.formState.isSubmitting && 'sr-only',
                    )}
                  />
                  Salvar
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
