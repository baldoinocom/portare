'use client'

import { UserSchema } from '@/actions/user/schema'
import { PasswordFormDialog } from '@/components/forms/form-dialogs/password-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
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
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@prisma/client'
import { LockKeyholeIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const AccountForm = ({ initialData }: { initialData?: User }) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: nullAsUndefined(initialData),
    mode: 'onChange',
  })

  const onSubmit = (values: z.infer<typeof UserSchema>) => {
    toast({
      title: 'Values submitted',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome de usuário</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormDescription>
                  Este é o nome de usuário que será exibido no seu perfil
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogTrigger asChild>
            <Button variant="ghost" className="h-auto" asChild>
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 px-8">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Senha</FormLabel>
                  <FormDescription>
                    Altere a senha do seu usuário
                  </FormDescription>
                </div>

                <LockKeyholeIcon className="size-5 shrink-0 opacity-50" />
              </FormItem>
            </Button>
          </DialogTrigger>
        </form>
      </Form>

      <FormDialogContent>
        <PasswordFormDialog />
      </FormDialogContent>
    </Dialog>
  )
}
