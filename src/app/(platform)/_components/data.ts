import {
  Building2Icon,
  BuildingIcon,
  FactoryIcon,
  HomeIcon,
  TruckIcon,
  Users2Icon,
} from 'lucide-react'
import { MenuItemProps } from './sidebar/menu'

export const navigation: MenuItemProps[] = [
  { name: 'Início', href: '/', icon: HomeIcon },
  { name: 'Frotas', href: '/fleets', icon: Building2Icon },
  { name: 'Clientes', href: '/clients', icon: FactoryIcon },
  {
    name: 'Agregados',
    href: '/aggregates',
    icon: BuildingIcon,
  },
  { name: 'Motoristas', href: '/drivers', icon: Users2Icon },
  {
    name: 'Veículos',
    icon: TruckIcon,
    children: [
      { name: 'Caminhões', href: '/trucks' },
      { name: 'Semirreboques', href: '/semi-trailers' },
    ],
  },
]

export const teams = [
  { id: 1, name: 'Heroicons', href: '#', initial: 'H', current: true },
  { id: 2, name: 'Tailwind Labs', href: '#', initial: 'T', current: true },
  { id: 3, name: 'Workcation', href: '#', initial: 'W', current: true },
]

export const userNavigation = [{ name: 'Your profile', href: '#' }]
