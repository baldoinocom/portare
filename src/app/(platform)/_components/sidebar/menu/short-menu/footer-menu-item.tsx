'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { checkNavigationPermission } from '@/permissions'
import { useShield } from '@/store/use-shield'
import { SettingsIcon } from 'lucide-react'
import Link from 'next/link'

export const ShortFooterMenuItem = () => {
  const { permissions } = useShield()

  const check = checkNavigationPermission(
    ['user', 'group', 'role', 'permission'],
    permissions,
  )

  return (
    <ul role="list" className="space-y-1">
      <li>
        {check && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href="/system/users"
                  className="group flex w-full items-center rounded-md text-sm font-semibold hover:bg-accent"
                >
                  <SettingsIcon className="size-5 shrink-0" />
                </Link>
              </Button>
            </TooltipTrigger>

            <TooltipContent side="right" className="ml-2 bg-foreground">
              <p className="text-xs text-background">Sistema</p>
            </TooltipContent>
          </Tooltip>
        )}
      </li>
    </ul>
  )
}
