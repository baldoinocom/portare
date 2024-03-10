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
      <LogoSlogan
        className={cn('hidden w-auto lg:flex', !collapsed && 'sr-only')}
      />

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
