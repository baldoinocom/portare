'use client'

import { Separator } from '@/components/ui/separator'
import { checkNavigationPermission } from '@/permissions'
import { useShield } from '@/store/use-shield'
import { PermissionGroup } from '@prisma/client'
import { navigation, otherNavigation } from '../../data'
import { ExpandableMenuItem } from './expandable-menu-item'
import { MenuItem } from './menu-item'

export const ListMenuItem = () => {
  const { permissions } = useShield()

  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map(({ groups, ...item }) => {
        const check = checkNavigationPermission(groups, permissions)

        if (!check) return null

        return (
          <li key={item.name}>
            {!item.children ? (
              <MenuItem item={item} />
            ) : (
              <ExpandableMenuItem item={item} />
            )}
          </li>
        )
      })}
    </ul>
  )
}

export const OtherListMenuItem = () => {
  const { permissions } = useShield()

  const containsPermission = checkNavigationPermission(
    otherNavigation.reduce((acc: PermissionGroup[], item) => {
      if (item.groups) acc.push(...item.groups)

      return acc
    }, []),
    permissions,
  )

  if (!containsPermission) return null

  return (
    <>
      <Separator className="mb-2" />

      <ul role="list" className="-mx-2 space-y-1">
        {otherNavigation.map(({ groups, ...item }) => {
          const check = checkNavigationPermission(groups, permissions)

          if (!check) return null

          return (
            <li key={item.name}>
              <MenuItem item={item} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
