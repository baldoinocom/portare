'use client'

import { action } from '@/actions'
import { UserResource } from '@/actions/types'
import { UserSchema, UserUpsertSchema } from '@/actions/user/schema'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { Button } from '@/components/ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const UserFormDialog = ({
  initialData,
}: {
  initialData?: UserResource
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof UserUpsertSchema>>({
    resolver: zodResolver(UserUpsertSchema),
    defaultValues: { new: !initialData, ...nullAsUndefined(initialData) },
  })

  const { create, update } = action.user()

  const { execute } = useAction(create, {
    onSuccess: () => {
      toast({
        title: 'Usuário cadastro com sucesso',
        description: 'O usuário foi cadastro com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar o usuário',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Usuário atualizado com sucesso',
        description: 'O usuário foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o usuário',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof UserUpsertSchema>) => {
    if (initialData) {
      await executeUpdate({
        externalUserId: initialData.externalUserId,
        ...values,
      })
    } else {
      await execute(UserSchema.parse(values))
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {initialData ? 'Cadastro do usuário' : 'Cadastro de usuário'}
            </DialogTitle>

            <DialogDescription>
              {initialData ? 'Altere os usuários' : 'Cadastre novos usuários'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">
                      Nome de usuário
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">
                      {initialData ? 'Nova senha' : 'Senha'}
                    </FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} type="password" />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />

                  {initialData && (
                    <FormDescription className="text-right">
                      Deixe em branco para manter a senha atual
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          </div>

          <FormAlert />

          <DialogFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <Loader2
                className={cn(
                  'mr-2 size-4 animate-spin',
                  !form.formState.isSubmitting && 'sr-only',
                )}
              />
              {initialData ? 'Salvar alterações' : 'Salvar'}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  )
}
