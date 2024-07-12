'use client'

import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatShortState } from '@/lib/formatters'
import { useQueryStates } from 'nuqs'
import { SearchParams, searchParams } from '../_lib/search-params'

export const Filters = ({
  onValueChange,
}: {
  onValueChange: (value: SearchParams) => void
}) => {
  const [{ state, closed }] = useQueryStates(searchParams)

  return (
    <>
      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium">Estado:</Label>
        <Select
          defaultValue={String(state)}
          onValueChange={(value) =>
            onValueChange({ state: value as 'sc' | 'pr', page: null })
          }
        >
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder={String(state)} />
          </SelectTrigger>
          <SelectContent className="min-w-[5rem]">
            {['sc', 'pr'].map((state) => (
              <SelectItem key={state} value={state}>
                {formatShortState(state)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Label className="text-sm font-medium">Situação:</Label>
        <Select
          defaultValue={String(closed)}
          onValueChange={(value) =>
            onValueChange({ closed: value === 'true', page: null })
          }
        >
          <SelectTrigger className="h-8 w-[150px]">
            <SelectValue placeholder={String(state)} />
          </SelectTrigger>
          <SelectContent className="min-w-[5rem]">
            <SelectItem value={String(false)}>Aberto</SelectItem>
            <SelectItem value={String(true)}>Fechado</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
