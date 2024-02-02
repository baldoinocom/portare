'use client'

import { action } from '@/actions'
import { UnitInclude } from '@/actions/types'
import { UnitSchema } from '@/actions/unit/schema'
import { CompanyInformation } from '@/components/forms/fields/company-information'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { FormFields } from '@/components/forms/ui/form-fields'
import { FormSession } from '@/components/forms/ui/form-session'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const UnitForm = ({ initialData }: { initialData?: UnitInclude }) => {
  const router = useRouter()

  const { toast } = useToast()

  const form = useForm<z.infer<typeof UnitSchema>>({
    resolver: zodResolver(UnitSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const { create, update } = action.unit()

  const { execute } = useAction(create, {
    onSuccess: (data) => {
      router.replace(String(data.companyId))
      toast({
        title: 'Unidade cadastrada com sucesso',
        description: 'A unidade foi cadastrada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar a unidade',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Unidade atualizada com sucesso',
        description: 'A unidade foi atualizada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar a unidade',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof UnitSchema>) => {
    if (initialData) {
      await executeUpdate({ companyId: initialData.companyId, ...values })
    } else {
      await execute(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <FormSession>
            <div>
              <h2 className="text-base font-semibold">
                Informações da unidade
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Gerenciar configurações de informações da unidade
              </p>
            </div>

            <FormFields>
              <CompanyInformation />
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
