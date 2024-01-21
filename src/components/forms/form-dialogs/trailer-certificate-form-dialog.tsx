'use client'

import { action } from '@/actions'
import { TrailerCertificateSchema } from '@/actions/trailer-certificate/schema'
import { Trailer, TrailerCertificate } from '@/actions/types'
import { TrailerSelect } from '@/components/forms/ui/trailer-select'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { formatExpirationType } from '@/lib/formatters'
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ExpirationType } from '@prisma/client'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const expirationTypes = Object.values(ExpirationType).map((type) => ({
  label: formatExpirationType(type),
  value: type,
}))

export const TrailerCertificateFormDialog = ({
  initialData,
  trailers,
}: {
  initialData?: TrailerCertificate
  trailers?: Trailer[]
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof TrailerCertificateSchema>>({
    resolver: zodResolver(TrailerCertificateSchema),
    defaultValues: {
      ...nullAsUndefined(initialData),
      startedAt: initialData?.startedAt
        ? new Date(initialData?.startedAt)
        : new Date(),
    },
  })

  const { create, update } = action.trailerCertificate()

  const { execute } = useAction(create, {
    onSuccess: () => {
      toast({
        title: 'Laudo de reboque registrado com sucesso',
        description: 'O laudo de reboque foi registrado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar o laudo de reboque',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Laudo de reboque atualizado com sucesso',
        description: 'O laudo de reboque foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o laudo de reboque',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof TrailerCertificateSchema>) => {
    if (initialData) {
      console.log(values)
      await executeUpdate({ id: initialData.id, ...values })
    } else {
      await execute(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? 'Registro do laudo de reboque'
              : 'Registro de laudo de reboque'}
          </DialogTitle>

          <DialogDescription>
            {initialData
              ? 'Altere os laudos de reboque'
              : 'Regstre novas laudos de reboque'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!initialData && (
            <FormField
              control={form.control}
              name="trailerId"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">Reboque</FormLabel>
                    <TrailerSelect trailers={trailers} />
                  </div>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="startedAt"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    Data de início
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="col-span-2">
                        <Button
                          variant="outline"
                          className={cn(
                            'justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? format(field.value, 'PP', { locale: ptBR })
                            : 'Escolha uma data'}
                          <CalendarIcon className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) => date < new Date('2000-01-01')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expirationType"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    Tipo de expiração
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="col-span-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {expirationTypes.map(({ value, label }, index) => (
                        <SelectItem
                          key={index}
                          title={label as string}
                          value={value}
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button disabled={form.formState.isSubmitting}>
            {initialData ? 'Salvar alterações' : 'Salvar'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
