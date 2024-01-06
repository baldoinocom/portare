import { Label } from '@/components/ui/label'
import { RadioGroupItem } from '@/components/ui/radio-group'

export const ClientTypeCard = ({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) => {
  return (
    <div>
      <RadioGroupItem value={value} id={value} className="peer sr-only" />
      <div className="absolute p-4">
        <RadioGroupItem
          value={value}
          className="border-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
        />
      </div>
      <Label
        htmlFor={value}
        className="relatve flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-8 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
      >
        {children}
      </Label>
    </div>
  )
}
