'use client'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navs: {
  name: string
  href: string
}[] = [
  {
    name: 'Perfil',
    href: '/settings',
  },
  {
    name: 'Conta',
    href: '/settings/account',
  },
  {
    name: 'Aparência',
    href: '/settings/appearance',
  },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {navs.map((nav) => (
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
      ))}
    </nav>
  )
}
