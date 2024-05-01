'use client'

import { CompanyWithDocumentTypeSchema } from '@/actions/company/schema'
import { InputMask } from '@/components/input-mask'
import { PlacesAutoComplete } from '@/components/places-autocomplete'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { formatShortState } from '@/lib/formatters'
import { cn, debounce } from '@/lib/utils'
import { validCEP } from '@/lib/validators'
import { Loader2Icon } from 'lucide-react'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const CompanyAddressInformation = () => {
  const { control, getValues, setValue } = useFormContext<{
    company: z.infer<typeof CompanyWithDocumentTypeSchema>
  }>()

  const [loading, setLoading] = React.useState(false)

  const fetchCEP = async () => {
    try {
      const cep = getValues('company.address.zipCode')
      if (validCEP(cep)) {
        setLoading(true)
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
        const data = await response.json()

        setValue(
          'company.address.state',
          formatShortState(data.uf) || undefined,
        )
        setValue('company.address.city', data.localidade)
        setValue('company.address.locale', data.logradouro)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const debouncedFetchCEP = debounce(fetchCEP, 500)

  return (
    <>
      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="company.address.zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <InputMask
                    {...field}
                    mask="99999-999"
                    placeholder="99999-000"
                    onInput={debouncedFetchCEP}
                    onChange={(e) => {
                      field.onChange(e)
                      if (!validCEP(e.target.value)) {
                        setValue('company.address.state', '')
                        setValue('company.address.city', '')
                        setValue('company.address.locale', '')
                      }
                    }}
                  />
                  <Loader2Icon
                    className={cn(
                      'ml-2 size-4 shrink-0 animate-spin opacity-50',
                      !loading && 'opacity-0',
                    )}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-3">
        <FormField
          control={control}
          name="company.address.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input {...field} className="uppercase" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-3">
        <FormField
          control={control}
          name="company.address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} className="uppercase" disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-full">
        <FormField
          control={control}
          name="company.address.locale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <PlacesAutoComplete
                  {...field}
                  onValueChange={field.onChange}
                  className="uppercase"
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
