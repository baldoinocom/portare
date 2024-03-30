'use client'

import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'

export const Body = ({ children }: { children: React.ReactNode }) => {
  const { collapsed } = useSidebar()

  return (
    <div className={cn('w-full', collapsed ? 'lg:ms-20' : 'lg:ms-72')}>
      {children}
    </div>
  )
}
