'use client'

import { action } from '@/actions'
import { BrandSchema } from '@/actions/brand/schema'
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
import { Brand } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const BrandFormDialog = ({ initialData }: { initialData?: Brand }) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof BrandSchema>>({
    resolver: zodResolver(BrandSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const onReset = () => {
    form.reset({ name: '' })
  }

  const { create, update } = action.brand()

  const { execute } = useAction(create, {
    onSuccess: () => {
      onReset()

      toast({
        title: 'Marca registrada com sucesso',
        description: 'A marca foi registrada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar a marca',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Marca atualizada com sucesso',
        description: 'A marca foi atualizada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar a marca',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof BrandSchema>) => {
    if (initialData) {
      await executeUpdate({ id: initialData.id, ...values })
    } else {
      await execute(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {initialData ? 'Registro da marca' : 'Registro de marca'}
            </DialogTitle>

            <DialogDescription>
              {initialData ? 'Altere as marcas' : 'Regstre novas marcas'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">Nome</FormLabel>
                    <FormControl className="col-span-3">
                      <Input {...field} className="uppercase" />
                    </FormControl>
                  </div>
                  <FormMessage className="text-right" />
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
