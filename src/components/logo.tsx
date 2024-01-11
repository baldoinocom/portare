import * as React from 'react'

import { cn } from '@/lib/utils'
import Image from 'next/image'

const Logo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('size-6', className)} {...props}>
    <Image src="/logo.png" alt="Logo" />
  </div>
))
Logo.displayName = 'Logo'
