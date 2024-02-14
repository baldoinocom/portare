import { CompanyWithDocumentTypeSchema } from '@/actions/company/schema'
import { InputMask } from '@/components/input-mask'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CompanyType } from '@prisma/client'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

export const CompanyInformation = ({
  companyType,
}: {
  companyType?: CompanyType
}) => {
  const { control } = useFormContext<{
    company: z.infer<typeof CompanyWithDocumentTypeSchema>
  }>()

  const isCPF = companyType === CompanyType.cpf

  return (
    <>
      <div className="sm:col-span-full">
        <FormField
          control={control}
          name="company.name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {companyType ? 'Nome' : 'Nome da razão social'}
              </FormLabel>
              <FormControl>
                <Input {...field} className="uppercase" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {!isCPF && (
        <div className="sm:col-span-3">
          <FormField
            control={control}
            name="company.tradeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome fantasia</FormLabel>
                <FormControl>
                  <Input {...field} className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <div className="sm:col-span-4">
        <FormField
          control={control}
          name="company.document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{isCPF ? 'CPF' : 'CNPJ'}</FormLabel>
              <FormControl>
                <InputMask
                  {...field}
                  mask={isCPF ? '999.999.999-99' : '99.999.999/9999-99'}
                  placeholder={isCPF ? '123.456.789-09' : '12.345.678/0001-98'}
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
