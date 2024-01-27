'use client'

import { action } from '@/actions'
import { AbsentDriverWithDateRangeSchema } from '@/actions/absent-driver/schema'
import { AbsentDriverInclude, DriverInclude } from '@/actions/types'
import { DriverSelect } from '@/components/forms/ui/driver-select'
import { StartAndEndDateSelect } from '@/components/forms/ui/start-and-end-date-select'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { formatDriverStatus } from '@/lib/formatters'
import { nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { DriverStatus } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const status = Object.values(DriverStatus).map((status) => ({
  label: formatDriverStatus(status),
  value: status,
}))

export const AbsentDriverFormDialog = ({
  initialData,
  drivers,
}: {
  initialData?: AbsentDriverInclude
  drivers?: DriverInclude[]
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof AbsentDriverWithDateRangeSchema>>({
    resolver: zodResolver(AbsentDriverWithDateRangeSchema),
    defaultValues: {
      ...nullAsUndefined(initialData),
      startedAt: initialData?.startedAt
        ? new Date(initialData?.startedAt)
        : new Date(),
      endedAt: initialData?.endedAt
        ? new Date(initialData?.endedAt)
        : new Date(),
    },
  })

  const { create, update } = action.absentDriver()

  const { execute } = useAction(create, {
    onSuccess: () => {
      toast({
        title: 'Ausência de motorista registrada com sucesso',
        description: 'A ausência de motorista foi registrada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar a ausência de motorista',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Ausência de motorista atualizada com sucesso',
        description: 'A ausência de motorista foi atualizada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar a ausência de motorista',
        description: error,
      })
    },
  })

  const onSubmit = async (
    values: z.infer<typeof AbsentDriverWithDateRangeSchema>,
  ) => {
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
              ? 'Registro da ausência de motorista'
              : 'Registro de ausência de motorista'}
          </DialogTitle>

          <DialogDescription>
            {initialData
              ? 'Altere as ausências de motorista'
              : 'Regstre novas ausências de motorista'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!initialData && (
            <FormField
              control={form.control}
              name="driverId"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">Motorista</FormLabel>
                    <DriverSelect drivers={drivers} />
                  </div>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="startedAt"
            render={() => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">
                    Data de início e fim
                  </FormLabel>
                  <StartAndEndDateSelect />
                </div>
                <FormMessage className="text-right" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="col-span-2 text-right">
                    Status do motorista
                  </FormLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="col-span-2">
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {status.map(({ value, label }, index) => (
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

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                  <FormLabel className="text-right">Observação</FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea {...field} />
                  </FormControl>
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
