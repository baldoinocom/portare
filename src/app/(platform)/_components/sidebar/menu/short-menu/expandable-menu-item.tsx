import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { checkNavigationPermission } from '@/permissions'
import { useShield } from '@/store/use-shield'
import { Disclosure } from '@headlessui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItemProps } from '..'

export const ShortExpandableMenuItem = ({ item }: { item: MenuItemProps }) => {
  const { permissions } = useShield()

  const pathname = usePathname()

  const current = item.href
    ? item.href === '/'
      ? pathname === item.href
      : pathname?.startsWith(item.href)
    : false

  return (
    <Disclosure as="div">
      {() => (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Disclosure.Button
                className={cn(
                  current ? 'bg-accent' : 'hover:bg-accent',
                  'flex w-full items-center rounded-md text-left text-xs font-extrabold',
                )}
                variant="ghost"
                size="sm"
                as={Button}
              >
                <item.icon className="size-5 shrink-0" />
              </Disclosure.Button>
            </TooltipTrigger>

            <TooltipContent side="right" className="ml-2 bg-foreground">
              <p className="text-xs text-background">
                {item.name} ({item.children?.length})
              </p>
            </TooltipContent>
          </Tooltip>

          <Disclosure.Panel as="ul" className="mt-1 flex flex-col gap-y-1">
            {item.children?.map(({ groups, ...subItem }) => {
              const check = checkNavigationPermission(groups, permissions)

              if (!check) return null

              return (
                <li key={subItem.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={subItem.href}
                          className={cn(
                            current ? 'bg-accent' : 'hover:bg-accent',
                            'flex w-full items-center justify-center rounded-md text-xs',
                          )}
                        >
                          {subItem.icon ? (
                            <subItem.icon className="size-5 shrink-0" />
                          ) : (
                            <div className=" font-extrabold">
                              {subItem.name.substring(0, 2)}
                            </div>
                          )}
                        </Link>
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent side="right" className="ml-2 bg-foreground">
                      <p className="text-xs text-background">{subItem.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              )
            })}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}
