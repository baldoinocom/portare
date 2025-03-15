'use client'

import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useSidebar } from '@/store/use-sidebar'
import { MenuIcon } from 'lucide-react'

export const SidebarButton = () => {
  const { collapsed, onOpen } = useSidebar()

  return (
    <>
      <div className="hidden lg:flex">
        <Logo className={cn('size-5 w-auto', !collapsed && 'sr-only')} />
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="-m-2.5 p-2.5 lg:hidden"
        onClick={onOpen}
      >
        <MenuIcon className="size-[1rem]" />
        <span className="sr-only">Open</span>
      </Button>
    </>
  )
}
