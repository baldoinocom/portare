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
  {
    name: 'Viagens',
    href: '/trips',
    icon: MapPinnedIcon,
    groups: ['trip'],
  },
  {
    name: 'Agrupamentos',
    href: '/groupings',
    icon: GroupIcon,
    groups: ['grouping'],
  },
  {
    name: 'Veículos',
    icon: TruckIcon,
    groups: ['truck', 'semiTrailer'],
    children: [
      {
        name: 'Caminhões',
        href: '/trucks',
        groups: ['truck'],
      },
      {
        name: 'Semirreboques',
        href: '/semi-trailers',
        groups: ['semiTrailer'],
      },
    ],
  },
  {
    name: 'Motoristas',
    href: '/drivers',
    icon: Users2Icon,
    groups: ['driver'],
  },
  {
    name: 'Agregados',
    href: '/aggregates',
    icon: BuildingIcon,
    groups: ['aggregate'],
  },
  {
    name: 'Origens/Destinos',
    href: '/clients',
    icon: FactoryIcon,
    groups: ['client'],
  },
  {
    name: 'Unidades',
    href: '/units',
    icon: Building2Icon,
    groups: ['unit'],
  },
]

export const otherNavigation: MenuItemProps[] = [
  {
    name: 'Encerramentos de MDF-e',
    href: '/mdf-e/sc',
    icon: FileSpreadsheetIcon,
    groups: ['mdfe'],
  },
]

export const userNavigation = [{ name: 'Seu Perfil', href: '/settings' }]
