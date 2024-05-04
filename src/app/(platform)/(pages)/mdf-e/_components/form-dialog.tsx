'use client'

import { FormAlert } from '@/components/forms/ui/form-alert'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
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
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { MDFe } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { MDFeUpdateSchema } from '../_actions/type'
import { updateMDFe } from '../_actions/update-mdfe'

export const FormDialog = ({ initialData }: { initialData?: MDFe }) => {
  const ref = React.useRef<HTMLDivElement>(null)

  const { toast } = useToast()

  const form = useForm<z.infer<typeof MDFeUpdateSchema>>({
    resolver: zodResolver(MDFeUpdateSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const { execute } = useAction(updateMDFe, {
    onSuccess: () => {
      ref.current?.click()
      toast({
        title: 'MDF-e atualizado com sucesso',
        description: 'O MDF-e foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o MDF-e',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof MDFeUpdateSchema>) => {
    if (initialData) {
      await execute([{ ...values, id: initialData.id }])
    }
  }

  return (
    <Form {...form}>
      <DialogClose asChild>
        <div className="sr-only" ref={ref} />
      </DialogClose>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <DialogHeader>
            <DialogTitle>Registro do MDF-e</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
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
              Salvar
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  )
}
