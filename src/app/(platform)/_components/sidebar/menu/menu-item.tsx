import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItemProps } from '.'

export const MenuItem = ({ item }: { item: MenuItemProps }) => {
  const pathname = usePathname()

  const current = item.href
    ? item.href === '/'
      ? pathname === item.href
      : pathname?.startsWith(item.href)
    : false

  return (
    <Button variant="ghost" size="sm" asChild className="justify-start">
      <Link
        href={item.href ?? '#'}
        className={cn(
          current ? 'bg-accent' : 'hover:bg-accent',
          'group flex w-full items-center gap-x-3 rounded-md text-xs font-semibold',
        )}
      >
        <item.icon className="size-5 shrink-0 text-foreground" />

        {item.name}

        {item.count && (
          <Badge
            variant="outline"
            className="ml-auto rounded-full px-3 text-xs"
          >
            {item.count}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
