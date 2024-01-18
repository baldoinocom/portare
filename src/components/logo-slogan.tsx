import * as React from 'react'

import { cn } from '@/lib/utils'
import Image from 'next/image'

export const LogoSlogan = React.forwardRef<
  React.ElementRef<typeof Image>,
  Omit<React.ComponentPropsWithoutRef<typeof Image>, 'src' | 'alt'>
>(({ className, height = 367, width = 958, ...props }, ref) => (
  <>
    <Image
      ref={ref}
      height={height}
      width={width}
      className={cn('block size-9 dark:hidden', className)}
      {...props}
      src="/logo-slogan.png"
      alt="portare-tms"
    />
    <Image
      ref={ref}
      height={height}
      width={width}
      className={cn('hidden size-9 dark:block', className)}
      {...props}
      src="/logo-slogan-dark.png"
      alt="portare-tms"
    />
  </>
))
LogoSlogan.displayName = 'LogoSlogan'
