import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { checkNavigationPermission } from '@/permissions'
import { useShield } from '@/store/use-shield'
import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItemProps } from '.'

export const ExpandableMenuItem = ({ item }: { item: MenuItemProps }) => {
  const { permissions } = useShield()

  const pathname = usePathname()

  const current = item.href
    ? item.href === '/'
      ? pathname === item.href
      : pathname?.startsWith(item.href)
    : false

  return (
    <Disclosure as="div">
      {({ open }) => (
        <>
          <Button variant="ghost" asChild>
            <Disclosure.Button
              className={cn(
                current ? 'bg-accent' : 'hover:bg-accent',
                'flex w-full items-center gap-x-3 rounded-md text-left text-sm font-semibold',
              )}
            >
              <item.icon className="shrink-0" />

              {item.name}

              <div className="ml-auto flex items-center gap-x-3">
                {item.count && (
                  <Badge variant="outline" className="rounded-full px-3">
                    {item.count}
                  </Badge>
                )}

                <ChevronRightIcon
                  className={cn(open && 'rotate-90', 'shrink-0')}
                />
              </div>
            </Disclosure.Button>
          </Button>

          <Disclosure.Panel as="ul" className="mt-1 flex flex-col gap-y-1">
            {item.children?.map(({ groups, ...subItem }) => {
              const check = checkNavigationPermission(groups, permissions)

              if (!check) return null

              return (
                <li key={subItem.name}>
                  <Button variant="ghost" asChild className="justify-start">
                    <Link
                      href={subItem.href}
                      className={cn(
                        current ? 'bg-accent' : 'hover:bg-accent',
                        'flex w-full items-center gap-x-3 rounded-md pl-9 pr-2 text-sm',
                      )}
                    >
                      {subItem.icon && <subItem.icon className="shrink-0" />}

                      {subItem.name}
                    </Link>
                  </Button>
                </li>
              )
            })}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
