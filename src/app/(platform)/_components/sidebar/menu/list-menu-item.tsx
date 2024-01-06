'use client'

import { navigation } from '../../data'
import { ExpandableMenuItem } from './expandable-menu-item'
import { MenuItem } from './menu-item'

export const ListMenuItem = () => {
  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          {!item.children ? (
            <MenuItem item={item} />
          ) : (
            <ExpandableMenuItem item={item} />
          )}
        </li>
      ))}
    </ul>
  )
}
