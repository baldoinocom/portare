'use client'

import { navigation, otherNavigation } from '../../../data'
import { ShortExpandableMenuItem } from './expandable-menu-item'
import { ShortMenuItem } from './menu-item'

export const ShortListMenuItem = () => {
  return (
    <ul role="list" className="space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          {!item.children ? (
            <ShortMenuItem item={item} />
          ) : (
            <ShortExpandableMenuItem item={item} />
          )}
        </li>
      ))}
    </ul>
  )
}

export const ShortOtherListMenuItem = () => {
  return (
    <ul role="list" className="space-y-1">
      {otherNavigation.map((item) => (
        <li key={item.name}>
          <ShortMenuItem item={item} />
        </li>
      ))}
    </ul>
  )
}
