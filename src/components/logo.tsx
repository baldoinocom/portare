import * as React from 'react'

import { cn } from '@/lib/utils'
import Image from 'next/image'

export const Logo = React.forwardRef<
  React.ElementRef<typeof Image>,
  Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'>
>(({ className, height = 237, width = 958, ...props }, ref) => (
  <>
    <Image
      ref={ref}
      height={height}
      width={width}
      className={cn('flex size-6 dark:hidden', className)}
      {...props}
      src="/logo.png"
      alt="portare"
    />
    <Image
      ref={ref}
      height={height}
      width={width}
      className={cn('hidden size-6 dark:flex', className)}
      {...props}
      src="/logo-dark.png"
      alt="portare"
    />
  </>
))
Logo.displayName = 'Logo'
