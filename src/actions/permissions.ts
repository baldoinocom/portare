import { PermissionCode, PermissionGroup } from '@prisma/client'

export type PermissionGroupCode = `${PermissionGroup}.${PermissionCode}`

type Permission = {
  group: string
  name: string
  value: PermissionGroupCode
}

export const permissions: Permission[] = [
  {
    group: 'Unidade',
    name: 'Criar unidade',
    value: 'unit.create',
  },
  {
    group: 'Unidade',
    name: 'Visualizar unidade',
    value: 'unit.view',
  },
  {
    group: 'Unidade',
    name: 'Editar unidade',
    value: 'unit.update',
  },
  {
    group: 'Unidade',
    name: 'Excluir unidade',
    value: 'unit.delete',
  },
]
