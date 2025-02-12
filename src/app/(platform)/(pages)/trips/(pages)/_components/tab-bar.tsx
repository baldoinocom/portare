'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const tabs: {
  name: string
  href: string
}[] = [
  { name: 'Programações', href: '/trips' },
  { name: 'Pré-programação ({{count}})', href: '/trips/drafts' },
]

export const TabBar = ({ drafts }: { drafts: number }) => {
  const router = useRouter()
  const pathname = usePathname()

  const current = (href: string) => href === pathname

  return (
    <>
      <div className="sm:hidden">
        <Select
          value={tabs.find(({ href }) => current(href))?.href}
          onValueChange={(value) => router.push(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma guia" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {tabs.map((tab, index) => (
                <SelectItem key={index} value={tab.href}>
                  {tab.name?.replace('{{count}}', String(drafts))}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="hidden sm:block">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
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
                {tab.name?.replace('{{count}}', String(drafts))}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </>
  )
}
