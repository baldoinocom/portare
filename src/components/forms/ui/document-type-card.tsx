import { Label } from '@/components/ui/label'
import { RadioGroupItem } from '@/components/ui/radio-group'
import * as React from 'react'

export const DocumentTypeCard = ({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) => {
  return (
    <div>
      <RadioGroupItem value={value} id={value} className="peer sr-only" />
      <Label
        htmlFor={value}
        className="flex items-center space-x-8 rounded-md border-2 border-muted bg-popover p-8 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
      >
        <RadioGroupItem
          value={value}
          className="border-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        />
        <div className="flex flex-col">{children}</div>
      </Label>
    </div>
  )
}
