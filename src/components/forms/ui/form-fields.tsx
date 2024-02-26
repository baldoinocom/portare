import { cn } from '@/lib/utils'

export const FormFields = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2',
        className,
      )}
      {...props}
    />
  )
}
