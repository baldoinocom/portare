'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = (state: string) => [
  { name: 'Abertos', href: '/mdf-e/' + state },
  { name: 'Encerrados', href: '/mdf-e/' + state + '/closed' },
]

export const SubTabBar = ({ count }: { count: number }) => {
  const pathname = usePathname()

  const state = pathname.split('/')[2]

  const current = (href: string) => href === pathname

  return (
    <div className="mt-2">
      <nav className="-mb-px flex space-x-8">
        {tabs(state).map((tab, index) => (
          <Button
            key={index}
            variant="ghost"
            asChild
            className={cn(
              current(tab.href)
                ? 'border-primary text-primary hover:text-primary'
                : 'border-transparent text-muted-foreground',
              'whitespace-nowrap rounded-none border-b-2 px-1 pb-4 hover:bg-transparent',
            )}
          >
            <Link key={index} href={tab.href}>
              {tab.name} {index === 0 ? `(${count})` : null}
            </Link>
          </Button>
        ))}
      </nav>
    </div>
  )
}
