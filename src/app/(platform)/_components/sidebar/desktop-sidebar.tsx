'use client'

import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'
import * as React from 'react'
import { Menu } from './menu'
import { ShortMenu } from './menu/short-menu'

const KEY = 'collapsed'

export const DesktopSidebar = () => {
  const { collapsed, onCollapse } = useSidebar()

  React.useEffect(() => {
    if (localStorage.getItem(KEY) === 'true') onCollapse()
  }, [onCollapse])

  React.useEffect(() => {
    localStorage.setItem(KEY, String(collapsed))
  }, [collapsed])

  return (
    <div
      className={cn(
        'fixed hidden h-screen border-r border-border transition-[width] duration-300 ease-in-out lg:z-50 lg:flex lg:flex-col',
        collapsed ? 'w-20' : 'w-72',
      )}
    >
      {collapsed ? <ShortMenu /> : <Menu />}
    </div>
  )
}
