import {
  Building2Icon,
  BuildingIcon,
  FactoryIcon,
  FileSpreadsheetIcon,
  GroupIcon,
  HomeIcon,
  MapPinnedIcon,
  TruckIcon,
  Users2Icon,
} from 'lucide-react'
import { MenuItemProps } from './sidebar/menu'

export const navigation: MenuItemProps[] = [
  { name: 'Início', href: '/', icon: HomeIcon },
  { name: 'Viagens', href: '/trips', icon: MapPinnedIcon },
  { name: 'Agrupamentos', href: '/groupings', icon: GroupIcon },
  {
    name: 'Veículos',
    icon: TruckIcon,
    children: [
      { name: 'Caminhões', href: '/trucks' },
      { name: 'Semirreboques', href: '/semi-trailers' },
    ],
  },
  { name: 'Motoristas', href: '/drivers', icon: Users2Icon },
  { name: 'Agregados', href: '/aggregates', icon: BuildingIcon },
  { name: 'Origens/Destinos', href: '/clients', icon: FactoryIcon },
  { name: 'Unidades', href: '/units', icon: Building2Icon },
]

export const otherNavigation: MenuItemProps[] = [
  {
    name: 'Encerramentos de MDF-e',
    href: '/mdf-e/sc',
    icon: FileSpreadsheetIcon,
  },
]

export const userNavigation = [{ name: 'Seu Perfil', href: '/settings' }]
