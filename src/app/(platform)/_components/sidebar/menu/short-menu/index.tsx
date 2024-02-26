import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { LucideIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { ButtonToggle } from './button-toggle'
import { ShortListMenuItem, ShortOtherListMenuItem } from './list-menu-item'

export type MenuItemProps = {
  name: string
  href?: string
  icon: LucideIcon
  count?: string
  children?: {
    name: string
    href: string
    icon?: LucideIcon
  }[]
}

export const ShortMenu = () => {
  return (
    <div className="group flex grow flex-col gap-y-5 overflow-y-auto bg-background px-4 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <ButtonToggle />
      </div>

      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ShortListMenuItem />
            </li>

            <li>
              <Separator className="mb-2" />
              <ShortOtherListMenuItem />
            </li>

            <li className="mt-auto">
              <ul role="list" className="space-y-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      asChild
                      className="justify-start px-2"
                    >
                      <Link
                        href="/system/users"
                        className="group flex w-full items-center gap-x-3 rounded-md hover:bg-accent"
                      >
                        <SettingsIcon className="shrink-0" />
                      </Link>
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent side="right" className="ml-2 bg-foreground">
                    <p className="text-background">Sistema</p>
                  </TooltipContent>
                </Tooltip>
              </ul>
            </li>
          </ul>
        </nav>
      </TooltipProvider>
    </div>
  )
}
