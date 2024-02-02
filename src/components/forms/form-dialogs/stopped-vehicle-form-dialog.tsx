'use client'

import { action } from '@/actions'
import { StoppedVehicleWithDateRangeSchema } from '@/actions/stopped-vehicle/schema'
import { StoppedVehicleInclude, VehicleInclude } from '@/actions/types'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { StartAndEndDateSelect } from '@/components/forms/ui/start-and-end-date-select'
import { VehicleSelect } from '@/components/forms/ui/vehicle-select'
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
import { formatVehicleStatus } from '@/lib/formatters'
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { VehicleStatus } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const status = Object.values(VehicleStatus).map((status) => ({
  label: formatVehicleStatus(status),
  value: status,
}))

export const StoppedVehicleFormDialog = ({
  initialData,
  vehicles,
}: {
  initialData?: StoppedVehicleInclude
  vehicles?: VehicleInclude[]
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof StoppedVehicleWithDateRangeSchema>>({
    resolver: zodResolver(StoppedVehicleWithDateRangeSchema),
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

  const { create, update } = action.stoppedVehicle()

  const { execute } = useAction(create, {
    onSuccess: () => {
      toast({
        title: 'Parada de veículo registrada com sucesso',
        description:
          'A parada de veículo de reboque foi registrada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar a parada de veículo',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Parada de veículo atualizada com sucesso',
        description: 'A parada de veículo foi atualizada com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar a parada de veículo',
        description: error,
      })
    },
  })

  const onSubmit = async (
    values: z.infer<typeof StoppedVehicleWithDateRangeSchema>,
  ) => {
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
              {initialData
                ? 'Registro da parada de veículo'
                : 'Registro de parada de veículo'}
            </DialogTitle>

            <DialogDescription>
              {initialData
                ? 'Altere as paradas de veículo'
                : 'Regstre novas paradas de veículo'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {!initialData && (
              <FormField
                control={form.control}
                name="vehicleId"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center gap-4 space-y-0">
                      <FormLabel className="text-right">Veículo</FormLabel>
                      <VehicleSelect vehicles={vehicles} />
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
                      Status do veículo
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
