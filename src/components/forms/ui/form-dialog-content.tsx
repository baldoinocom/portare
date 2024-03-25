import { DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import * as React from 'react'

export const FormDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogContent
      ref={ref}
      className={cn('sm:max-w-[425px]', className)}
      {...props}
    >
      {children}
    </DialogContent>
  )
})
FormDialogContent.displayName = 'FormDialogContent'
