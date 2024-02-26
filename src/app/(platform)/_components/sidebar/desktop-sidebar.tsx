'use client'

import { useSidebar } from '@/store/use-sidebar'
import { Menu } from './menu'
import { ShortMenu } from './menu/short-menu'

export const DesktopSidebar = () => {
  const { collapsed } = useSidebar()

  return (
    <div className="hidden h-screen border-r border-border lg:z-50 lg:flex lg:flex-col">
      {collapsed ? <ShortMenu /> : <Menu />}
    </div>
  )
}
