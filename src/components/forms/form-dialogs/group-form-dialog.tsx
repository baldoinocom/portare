'use client'

import { action } from '@/actions'
import { GroupSchema } from '@/actions/group/schema'
import { GroupResource, RoleResource } from '@/actions/types'
import { FormAlert } from '@/components/forms/ui/form-alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useToast } from '@/components/ui/use-toast'
import { useAction } from '@/hooks/use-action'
import { cn, nullAsUndefined } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

export const GroupFormDialog = ({
  initialData,
  roles,
}: {
  initialData?: GroupResource
  roles?: RoleResource[]
}) => {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof GroupSchema>>({
    resolver: zodResolver(GroupSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const {
    fields: roleFields,
    append,
    remove,
  } = useFieldArray({ control: form.control, name: 'roles', keyName: 'key' })

  const onReset = () => {
    form.reset({ name: '', roles: [] })
  }

  const { create, update } = action.group()

  const { execute } = useAction(create, {
    onSuccess: () => {
      onReset()

      toast({
        title: 'Grupo registrado com sucesso',
        description: 'O grupo foi registrado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao registrar o grupo',
        description: error,
      })
    },
  })

  const { execute: executeUpdate } = useAction(update, {
    onSuccess: () => {
      toast({
        title: 'Grupo atualizado com sucesso',
        description: 'O grupo foi atualizado com sucesso! 🎉',
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar o grupo',
        description: error,
      })
    },
  })

  const onSubmit = async (values: z.infer<typeof GroupSchema>) => {
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
              {initialData ? 'Registro do grupo' : 'Registro de grupo'}
            </DialogTitle>

            <DialogDescription>
              {initialData ? 'Altere os grupos' : 'Regstre novos grupos'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} className="uppercase" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="w-full">
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'h-auto justify-between',
                            !roleFields?.length && 'text-muted-foreground',
                          )}
                        >
                          {roleFields?.length ? (
                            <div className="flex flex-wrap gap-2">
                              {roles
                                ?.filter(({ id }) =>
                                  roleFields.some((v) => v.id === id),
                                )
                                .map(({ name }, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="font-medium"
                                  >
                                    {name}
                                  </Badge>
                                ))}
                            </div>
                          ) : (
                            'Selecione o cargo'
                          )}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Pesquisar" />
                        <CommandEmpty>Nenhum</CommandEmpty>
                        <CommandGroup>
                          <ScrollArea className="flex max-h-72 flex-col">
                            {roles?.map(({ id, name }, index) => (
                              <CommandItem
                                key={index}
                                value={name}
                                onSelect={() => {
                                  if (roleFields?.some((v) => v.id === id)) {
                                    remove(
                                      roleFields.findIndex((v) => v.id === id),
                                    )
                                  } else {
                                    append({ id })
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 size-4',
                                    roleFields?.length &&
                                      roleFields.some((v) => v.id === id)
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {name}
                              </CommandItem>
                            ))}
                          </ScrollArea>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
              {initialData ? 'Salvar alterações' : 'Salvar'}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  )
}
