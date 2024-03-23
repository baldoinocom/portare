'use client'

import { Button } from '@/components/ui/button'
import { checkNavigationPermission } from '@/permissions'
import { useShield } from '@/store/use-shield'
import { SettingsIcon } from 'lucide-react'
import Link from 'next/link'

export const FooterMenuItem = () => {
  const { permissions } = useShield()

  const check = checkNavigationPermission(
    ['user', 'group', 'role', 'permission'],
    permissions,
  )

  return (
    <ul role="list" className="-mx-2 space-y-1">
      <li>
        {check && (
          <Button variant="ghost" asChild className="justify-start">
            <Link
              href="/system/users"
              className="group flex w-full items-center gap-x-3 rounded-md text-sm font-semibold hover:bg-accent"
            >
              <SettingsIcon className="shrink-0 text-foreground" />
              Sistema
            </Link>
          </Button>
        )}
      </li>
    </ul>
  )
}
