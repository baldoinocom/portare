import { LogoSlogan } from '@/components/logo-slogan'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { LucideIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { ListMenuItem, OtherListMenuItem } from './list-menu-item'
import { ToggleButton } from './short-menu/toggle-button'

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

export const Menu = ({ mobile }: { mobile?: boolean }) => {
  return (
    <div className="group flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <div className="px-2">
          <LogoSlogan className="w-auto" />
        </div>

        {!mobile && <ToggleButton />}
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ListMenuItem />
          </li>

          <li>
            <Separator className="mb-2" />
            <OtherListMenuItem />
          </li>

          <li className="mt-auto">
            <Button variant="ghost" asChild className="justify-start">
              <Link
                href="/system/users"
                className="group -mx-2 flex w-full items-center gap-x-3 rounded-md text-sm font-semibold hover:bg-accent"
              >
                <SettingsIcon className="shrink-0 text-foreground" />
                Sistema
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
