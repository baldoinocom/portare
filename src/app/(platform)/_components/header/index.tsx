'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/store/use-sidebar'
import { MenuIcon } from 'lucide-react'
import { ModeToggle } from './mode-toggle'
import { ProfileDropdown } from './profile-dropdown'

export const Header = () => {
  const { onCollapse } = useSidebar()

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        className="-m-2.5 p-2.5 lg:hidden"
        onClick={onCollapse}
      >
        <MenuIcon />
        <span className="sr-only">Open sidebar</span>
      </Button>

      <Separator className="h-6 w-px lg:hidden" orientation="vertical" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">{/* Trips */}</div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <ModeToggle />

          <Separator
            className="hidden lg:block lg:h-6 lg:w-px"
            orientation="vertical"
          />

          <ProfileDropdown />
        </div>
      </div>
    </div>
  )
}
