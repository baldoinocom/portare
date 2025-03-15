import { Logo } from '@/components/logo'
import { PermissionGroup } from '@prisma/client'
import { LucideIcon } from 'lucide-react'
import { FooterMenuItem } from './footer-menu-item'
import { ListMenuItem, OtherListMenuItem } from './list-menu-item'
import { ToggleButton } from './short-menu/toggle-button'

export type MenuItemProps = {
  groups?: PermissionGroup[]
  name: string
  href?: string
  icon: LucideIcon
  count?: string
  children?: {
    groups?: PermissionGroup[]
    name: string
    href: string
    icon?: LucideIcon
  }[]
}

export const Menu = ({ mobile }: { mobile?: boolean }) => {
  return (
    <div className="group flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-4">
      <div className="flex h-14 shrink-0 items-center">
        <div className="px-2">
          <Logo className="size-4 w-auto" />
        </div>

        {!mobile && <ToggleButton />}
      </div>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ListMenuItem />
          </li>

          <li>
            <OtherListMenuItem />
          </li>

          <li className="mt-auto">
            <FooterMenuItem />
          </li>
        </ul>
      </nav>
    </div>
  )
}
