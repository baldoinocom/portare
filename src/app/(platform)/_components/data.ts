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

export const userNavigation = [{ name: 'Seu Perfil', href: '/settings' }]
