'use client'

import { checkNavigationPermission } from '@/permissions'
import { useShield } from '@/store/use-shield'
import { PermissionGroup } from '@prisma/client'
import { navigation, otherNavigation } from '../../../data'
import { ShortExpandableMenuItem } from './expandable-menu-item'
import { ShortMenuItem } from './menu-item'

export const ShortListMenuItem = () => {
  const { permissions } = useShield()

  return (
    <ul role="list" className="space-y-1">
      {navigation.map(({ groups, ...item }) => {
        const check = checkNavigationPermission(groups, permissions)

        if (!check) return null

        return (
          <li key={item.name}>
            {!item.children ? (
              <ShortMenuItem item={item} />
            ) : (
              <ShortExpandableMenuItem item={item} />
            )}
          </li>
        )
      })}
    </ul>
  )
}

export const ShortOtherListMenuItem = () => {
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
    <ul role="list" className="space-y-1">
      {otherNavigation.map(({ groups, ...item }) => {
        const check = checkNavigationPermission(groups, permissions)

        if (!check) return null

        return (
          <li key={item.name}>
            <ShortMenuItem item={item} />
          </li>
        )
      })}
    </ul>
  )
}
