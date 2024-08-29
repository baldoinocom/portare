'use client'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { checkNavigationPermission } from '@/permissions'
import { useShield } from '@/store/use-shield'
import { PermissionGroup } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navs: {
  name: string
  href: string
  groups?: PermissionGroup[]
}[] = [
  {
    name: 'Usuários',
    href: '/system/users',
    groups: ['user'],
  },
  {
    name: 'Cargos',
    href: '/system/groups',
    groups: ['group'],
  },
  {
    name: 'Funções',
    href: '/system/roles',
    groups: ['role'],
  },
  {
    name: 'Permissões',
    href: '/system/permissions',
    groups: ['permission'],
  },
]

export function SidebarNav() {
  const { permissions } = useShield()

  const pathname = usePathname()

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {navs.map(({ groups, ...nav }) => {
        const check = checkNavigationPermission(groups, permissions)

        if (!check) return null

        return (
          <Link
            key={nav.href}
            href={nav.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              pathname === nav.href
                ? 'bg-muted hover:bg-muted'
                : 'hover:bg-transparent hover:underline',
              'justify-start',
            )}
          >
            {nav.name}
          </Link>
        )
      })}
    </nav>
  )
}
