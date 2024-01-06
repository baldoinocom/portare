import {
  Building2Icon,
  BuildingIcon,
  FactoryIcon,
  HomeIcon,
  Users2Icon,
} from 'lucide-react'
import { MenuItemProps } from './sidebar/menu'

export const navigation: MenuItemProps[] = [
  { name: 'Início', href: '/', icon: HomeIcon },
  { name: 'Motoristas', href: '/drivers', icon: Users2Icon },
  { name: 'Frotas', href: '/fleets', icon: FactoryIcon },
  {
    name: 'Agregados',
    href: '/aggregates',
    icon: BuildingIcon,
  },
  {
    name: 'Origens/Destinos',
    href: '/clients',
    icon: Building2Icon,
  },
  // {
  //   name: 'Projects',
  //   icon: HomeIcon,
  //   count: '+9',
  //   children: [
  //     { name: 'GraphQL API', href: '#' },
  //     { name: 'iOS App', href: '#' },
  //     { name: 'Android App', href: '#' },
  //     { name: 'New Customer Portal', href: '#' },
  //   ],
  // },
]

export const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: true },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: true },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: true },
]

export const userNavigation = [{ name: 'Your profile', href: '#' }]
