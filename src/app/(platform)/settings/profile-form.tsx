'use client'

import { action } from '@/actions'
import { PersonWithoutRelationshipSchema } from '@/actions/person/schema'
import { InputMask } from '@/components/input-mask'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Person } from '@prisma/client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export const ProfileForm = ({
  initialData,
}: {
  initialData?: Person | null
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof PersonWithoutRelationshipSchema>>({
    resolver: zodResolver(PersonWithoutRelationshipSchema),
    defaultValues: nullAsUndefined(initialData),
    mode: 'onChange',
  })

  const { update } = action.person()

  const { execute } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Perfil atualizado com sucesso',
        description: 'O perfil foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o perfil',
        description: error,
      })
    },
  })

  const onSubmit = async (
    values: z.infer<typeof PersonWithoutRelationshipSchema>,
  ) => {
    if (initialData) await execute({ id: initialData.id, ...values })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} disabled className="uppercase" />
              </FormControl>
              <FormDescription>
                Este é o seu nome de exibição público
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apelido</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!initialData}
                  className="uppercase"
                />
              </FormControl>
              <FormDescription>
                Este é o seu apelido de exibição público
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  disabled
                  mask="999.999.999-99"
                  placeholder="123.456.789-87"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  disabled={!initialData}
                  mask="(99) 9 9999-9999"
                  placeholder="(40) 9 8765-4321"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {initialData && form.formState.isDirty && (
          <Button>Atualizar perfil</Button>
        )}
      </form>
    </Form>
  )
}
