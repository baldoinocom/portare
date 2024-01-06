'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSignIn } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  username: z
    .string({ required_error: 'O nome de usuário é obrigatório' })
    .min(2, { message: 'O nome de usuário deve ter no mínimo 2 caracteres' })
    .max(50, { message: 'O nome de usuário deve ter no máximo 50 caracteres' }),
  password: z
    .string({ required_error: 'A senha é obrigatória' })
    .min(4, { message: 'A senha deve ter no mínimo 4 caracteres' })
    .max(100, {
      message: 'O nome de usuário deve ter no máximo 100 caracteres',
    }),
})

export default function Page() {
  const { signIn, setActive } = useSignIn()

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams?.get('redirect_url')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const result = await signIn?.create({
        identifier: values.username,
        password: values.password,
      })

      if (result?.status === 'complete' && setActive) {
        await setActive({ session: result.createdSessionId })
        return router.push(redirectUrl ?? '/#')
      }
    } catch (error) {
      form.setError('root', { message: 'Usuário ou senha inválidos' })
    }
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Logo"
        />

        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight">
          Entrar em sua conta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormMessage className="text-center">
              {form.formState.errors.root?.message}
            </FormMessage>

            <Button disabled={form.formState.isSubmitting} type="submit">
              Entrar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
