import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, useFormField } from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

export const StartAndEndDateSelect = () => {
  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl className="col-span-3">
          <Button
            variant="outline"
            className={cn(
              'justify-between',
              !getValues(name) && 'text-muted-foreground',
            )}
          >
            {getValues('startedAt') ? (
              getValues('endedAt') ? (
                <>
                  {format(getValues('startedAt'), 'PP', { locale: ptBR })} -{' '}
                  {format(getValues('endedAt'), 'PP', { locale: ptBR })}
                </>
              ) : (
                format(getValues('startedAt'), 'PP', { locale: ptBR })
              )
            ) : (
              <span>Escolha uma data</span>
            )}
            <CalendarIcon className="ml-2 size-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="p-0" align="end">
        <Calendar
          mode="range"
          selected={{
            from: getValues('startedAt'),
            to: getValues('endedAt'),
          }}
          onSelect={(date) => {
            setValue('startedAt', date?.from, { shouldDirty: true })
            setValue('endedAt', date?.to, { shouldDirty: true })
          }}
          disabled={(date: Date) => date < new Date('2000-01-01')}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
