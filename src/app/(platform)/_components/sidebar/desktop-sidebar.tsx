'use client'

import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'
import { Menu } from './menu'
import { ShortMenu } from './menu/short-menu'

export const DesktopSidebar = () => {
  const { collapsed } = useSidebar()

  return (
    <div
      className={cn(
        'hidden h-screen border-r border-border lg:z-50 lg:flex lg:flex-col',
        !collapsed && 'min-w-72',
      )}
    >
      {collapsed ? <ShortMenu /> : <Menu />}
    </div>
  )
}
