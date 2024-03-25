import { cn } from '@/lib/utils'
import Link from 'next/link'
import * as React from 'react'

export const EmptyState = React.forwardRef<
  React.ElementRef<typeof Link>,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, children, ...props }, ref) => (
  <Link
    ref={ref}
    className={cn('w-full focus:outline-none', className)}
    {...props}
  >
    <button
      type="button"
      className="relative block w-full rounded-lg border-2 border-dashed border-border p-12 text-center hover:border-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {children}
    </button>
  </Link>
))
EmptyState.displayName = 'EmptyState'
