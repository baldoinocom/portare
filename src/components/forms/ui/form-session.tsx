import { cn } from '@/lib/utils'

export const FormSession = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3',
        className,
      )}
      {...props}
    />
  )
}
