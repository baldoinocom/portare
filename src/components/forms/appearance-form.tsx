'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn, nullAsUndefined } from '@/lib/utils'
import { usePageWidth } from '@/store/use-page-width'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const appearanceFormSchema = z.object({
  theme: z.enum(['system', 'light', 'dark'], {
    required_error: 'Selecione um tema para o painel',
  }),
  width: z.enum(['flexible', 'full'], {
    required_error: 'Selecione a largura da página',
  }),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export const AppearanceForm = ({
  initialData,
}: {
  initialData?: Partial<AppearanceFormValues>
}) => {
  const { theme, systemTheme, setTheme } = useTheme()
  const { setWidth } = usePageWidth()

  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: nullAsUndefined(initialData),
  })

  const onSubmit = (data: AppearanceFormValues) => {
    setTheme(data.theme)
    setWidth(data.width)
  }

  const dark =
    theme === 'system' ? systemTheme === 'dark' : initialData?.theme === 'dark'
  const full = initialData?.width === 'full'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Tema</FormLabel>
              <FormDescription>Selecione o tema para o painel</FormDescription>
              <FormMessage />

              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2 xl:max-w-2xl xl:grid-cols-3"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="light" className="sr-only" />
                    </FormControl>

                    <Template full={full} />
                    <span className="block w-full p-2 text-center font-normal">
                      Claro
                    </span>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="dark" className="sr-only" />
                    </FormControl>

                    <Template dark full={full} />
                    <span className="block w-full p-2 text-center font-normal">
                      Escuro
                    </span>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="system" className="sr-only" />
                    </FormControl>

                    <Template dark={systemTheme === 'dark'} full={full} />
                    <span className="block w-full p-2 text-center font-normal">
                      Sistema
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Largura</FormLabel>
              <FormDescription>Selecione a largura da página</FormDescription>
              <FormMessage />

              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-2 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="flexible" className="sr-only" />
                    </FormControl>

                    <Template dark={dark} />
                    <span className="block w-full p-2 text-center font-normal">
                      Flexível
                    </span>
                  </FormLabel>
                </FormItem>

                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="full" className="sr-only" />
                    </FormControl>

                    <Template dark={dark} full />
                    <span className="block w-full p-2 text-center font-normal">
                      Máximo
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Atualizar preferências
        </Button>
      </form>
    </Form>
  )
}

const Template = ({ dark, full }: { dark?: boolean; full?: boolean }) => (
  <div className="w-[220px] items-center rounded-md border-2 border-muted p-1 hover:border-accent">
    <div
      className={cn(
        'space-y-2 rounded-sm p-2',
        dark ? 'bg-slate-950' : 'bg-[#ecedef]',
        !full && 'px-8',
      )}
    >
      <div
        className={cn(
          'space-y-2 rounded-md p-2 shadow-sm',
          dark ? 'bg-slate-800' : 'bg-white',
        )}
      >
        <div
          className={cn(
            'h-2 w-[80px] rounded-lg',
            dark ? 'bg-slate-400' : 'bg-[#ecedef]',
          )}
        />
        <div
          className={cn(
            'h-2 w-[100px] rounded-lg',
            dark ? 'bg-slate-400' : 'bg-[#ecedef]',
          )}
        />
      </div>

      <div
        className={cn(
          'flex items-center space-x-2 rounded-md  p-2 shadow-sm',
          dark ? 'bg-slate-800' : 'bg-white',
        )}
      >
        <div
          className={cn(
            'h-4 w-4 rounded-full',
            dark ? 'bg-slate-400' : 'bg-[#ecedef]',
          )}
        />
        <div
          className={cn(
            'h-2 w-[100px] rounded-lg',
            dark ? 'bg-slate-400' : 'bg-[#ecedef]',
          )}
        />
      </div>
      <div
        className={cn(
          'flex items-center space-x-2 rounded-md  p-2 shadow-sm',
          dark ? 'bg-slate-800' : 'bg-white',
        )}
      >
        <div
          className={cn(
            'h-4 w-4 rounded-full',
            dark ? 'bg-slate-400' : 'bg-[#ecedef]',
          )}
        />
        <div
          className={cn(
            'h-2 w-[100px] rounded-lg',
            dark ? 'bg-slate-400' : 'bg-[#ecedef]',
          )}
        />
      </div>
    </div>
  </div>
)
