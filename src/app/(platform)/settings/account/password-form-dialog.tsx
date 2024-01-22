'use client'

import { action } from '@/actions'
import { UserPasswordFormSchema } from '@/actions/user/schema'
import { Button } from '@/components/ui/button'
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { useClerk } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const PasswordFormDialog = () => {
  const { user } = useClerk()

  const { toast } = useToast()

  const form = useForm<z.infer<typeof UserPasswordFormSchema>>({
    resolver: zodResolver(UserPasswordFormSchema),
    defaultValues: { externalUserId: user?.id },
  })

  const { updatePassword } = action.user()

  const { execute } = useAction(updatePassword, {
    onSuccess: () => {
      toast({
        title: 'Senha atualizada com sucesso',
        description: 'A senha foi atualizada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar a senha',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof UserPasswordFormSchema>) => {
    if (user) {
      await execute(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>Alterar senha</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">Senha atual</FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} type="password" />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">Nova senha</FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} type="password" />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">
                    Senha de confirmação
                  </FormLabel>
                  <FormControl className="col-span-3">
                    <Input {...field} type="password" />
                  </FormControl>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button disabled={form.formState.isSubmitting}>
            Atualizar senha
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
