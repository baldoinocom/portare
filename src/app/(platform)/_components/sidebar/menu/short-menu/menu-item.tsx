import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuItemProps } from '..'

export const ShortMenuItem = ({ item }: { item: MenuItemProps }) => {
  const pathname = usePathname()

  const current = item.href
    ? item.href === '/'
      ? pathname === item.href
      : pathname?.startsWith(item.href)
    : false

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" asChild>
          <Link
            href={item.href ?? '#'}
            className={cn(
              current ? 'bg-accent' : 'hover:bg-accent',
              'group flex w-full items-center rounded-md text-sm font-semibold',
            )}
          >
            <item.icon className="size-5 shrink-0 text-foreground" />
          </Link>
        </Button>
      </TooltipTrigger>

      <TooltipContent side="right" className="ml-2 bg-foreground">
        <p className="text-xs text-background">{item.name}</p>
      </TooltipContent>
    </Tooltip>
  )
}
