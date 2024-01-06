import { Button } from '@/components/ui/button'
import { LucideIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { ListMenuItem } from './list-menu-item'

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

export const Menu = () => {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Logo"
        />
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ListMenuItem />
          </li>

          <li className="mt-auto">
            <Button variant="ghost" asChild className="justify-start">
              <Link
                href="#"
                className="group -mx-2 flex w-full gap-x-3 rounded-md text-sm font-semibold hover:bg-accent"
              >
                <SettingsIcon className="shrink-0" />
                Settings
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
