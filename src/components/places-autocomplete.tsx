'use client'

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import Script from 'next/script'
import * as React from 'react'
import usePlacesAutocomplete from 'use-places-autocomplete'

export type InputProps = React.ComponentProps<typeof Input>

export const PlacesAutoComplete = ({
  className,
  value,
  onValueChange,
  onChange,
  onBlur,
  onFocus,
  ...props
}: InputProps & { onValueChange?: (value: string) => void }) => {
  const inputRef = React.useRef<HTMLInputElement>(null)

  const [isOpen, setOpen] = React.useState(false)

  const {
    init,
    setValue,
    suggestions: { status, data },
  } = usePlacesAutocomplete({
    initOnMount: false,
    requestOptions: { componentRestrictions: { country: 'br' } },
  })

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (!input) return

      if (!isOpen) setOpen(true)

      if (event.key === 'Escape') input.blur()
    },
    [isOpen],
  )

  const handleSelect = React.useCallback(
    (description: string) => {
      onValueChange?.(description)
      inputRef?.current?.blur()
    },
    [onValueChange],
  )

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        onLoad={init}
      />

      <Command
        className={cn('overflow-visible', className)}
        onKeyDown={handleKeyDown}
      >
        <div>
          <Input
            ref={inputRef}
            value={value}
            onChange={(event) => {
              setValue(event.target.value)
              onValueChange?.(event.target.value)
              onChange?.(event)
            }}
            onBlur={(event) => {
              setOpen(false)
              onBlur?.(event)
            }}
            onFocus={(event) => {
              setOpen(true)
              onFocus?.(event)
            }}
            className={className}
            {...props}
          />
        </div>
        <div className="relative">
          {status === 'OK' && isOpen && (
            <div className="absolute top-2 z-50 w-full rounded-md bg-background outline-none animate-in fade-in-0 zoom-in-95">
              <CommandList className="rounded-md border border-border">
                <CommandGroup>
                  {data?.map(({ description }, index) => (
                    <CommandItem
                      key={index}
                      value={description}
                      onSelect={handleSelect}
                      onMouseDown={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 size-4',
                          String(value).toLowerCase() ===
                            description.toLowerCase()
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {description}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </div>
          )}
        </div>
      </Command>
    </>
  )
}
PlacesAutoComplete.displayName = 'PlacesAutoComplete'
