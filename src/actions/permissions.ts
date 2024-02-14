import { PermissionCode, PermissionGroup } from '@prisma/client'

export type Permissions = `${PermissionGroup}.${PermissionCode}`

export const permissions: {
  group: string
  name: string
  value: Permissions
}[] = [
  {
    group: 'Unidade',
    name: 'Criar unidade',
    value: 'units.create',
  },
  {
    group: 'Unidade',
    name: 'Visualizar unidade',
    value: 'units.view',
  },
  {
    group: 'Unidade',
    name: 'Editar unidade',
    value: 'units.update',
  },
  {
    group: 'Unidade',
    name: 'Excluir unidade',
    value: 'units.delete',
  },
]
