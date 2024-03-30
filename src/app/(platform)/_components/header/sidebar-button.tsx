'use client'

import { LogoSlogan } from '@/components/logo-slogan'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'
import { MenuIcon } from 'lucide-react'

export const SidebarButton = () => {
  const { collapsed, onOpen } = useSidebar()

  return (
    <>
      <div className="hidden lg:flex">
        <LogoSlogan className={cn('w-auto', !collapsed && 'sr-only')} />
      </div>

      <Button
        variant="ghost"
        className="-m-2.5 p-2.5 lg:hidden"
        onClick={onOpen}
      >
        <MenuIcon />
        <span className="sr-only">Open</span>
      </Button>
    </>
  )
}
