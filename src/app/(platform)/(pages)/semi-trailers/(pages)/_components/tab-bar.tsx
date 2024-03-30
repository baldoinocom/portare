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
import { checkNavigationPermission } from '@/permissions'
import { useShield } from '@/store/use-shield'
import { PermissionGroup } from '@prisma/client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const tabs: {
  name: string
  href: string
  groups?: PermissionGroup[]
}[] = [
  {
    name: 'Cadastros',
    href: '/semi-trailers',
    groups: ['semiTrailer'],
  },
  {
    name: 'Configurações',
    href: '/semi-trailers/configurations',
    groups: ['trailerConfiguration'],
  },
  {
    name: 'Tipos',
    href: '/semi-trailers/types',
    groups: ['trailerType'],
  },
  {
    name: 'Cargas',
    href: '/semi-trailers/cargos',
    groups: ['cargo'],
  },
  {
    name: 'Laudos',
    href: '/semi-trailers/certificates',
    groups: ['trailerCertificate'],
  },
  {
    name: 'Paradas',
    href: '/semi-trailers/stopped',
    groups: ['stoppedVehicle'],
  },
  {
    name: 'Marcas',
    href: '/semi-trailers/brands',
    groups: ['brand'],
  },
]

export const TabBar = () => {
  const { permissions } = useShield()

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
              {tabs.map(({ groups, ...tab }, index) => {
                const check = checkNavigationPermission(groups, permissions)

                if (!check) return null

                return (
                  <SelectItem key={index} value={tab.href}>
                    {tab.name}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="hidden sm:block">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(({ groups, ...tab }, index) => {
            const check = checkNavigationPermission(groups, permissions)

            if (!check) return null

            return (
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
                  {tab.name}
                </Link>
              </Button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
