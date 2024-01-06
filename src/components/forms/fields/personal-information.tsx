import { PersonWithoutRelationshipSchema } from '@/actions/person/schema'
import { InputMask } from '@/components/input-mask'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const PersonalInformation = () => {
  const { control } = useFormContext<{
    person: z.infer<typeof PersonWithoutRelationshipSchema>
  }>()

  return (
    <>
      <div className="sm:col-span-full">
        <FormField
          control={control}
          name="person.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input {...field} className="uppercase" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-3">
        <FormField
          control={control}
          name="person.nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apelido</FormLabel>
              <FormControl>
                <Input {...field} className="uppercase" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="person.cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF</FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  mask="999.999.999-99"
                  placeholder="123.456.789-87"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="person.phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  mask="(99) 9 9999-9999"
                  placeholder="(40) 9 8765-4321"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  )
}
