'use client'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navs = [
  {
    title: 'Perfil',
    href: '/settings',
  },
  {
    title: 'Conta',
    href: '/settings/account',
  },
  {
    title: 'Aparência',
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
          {nav.title}
        </Link>
      ))}
    </nav>
  )
}
