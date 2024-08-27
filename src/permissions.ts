import {
  PermissionCode,
  PermissionGroup,
  PermissionGuard,
  Permission as PrismaPermission,
} from '@prisma/client'

export const SEPARATOR = '.'

export type PermissionGroupCode =
  `${PermissionGroup}${typeof SEPARATOR}${PermissionCode}`

export type PermissionOverwriter =
  | PermissionGroupCode[]
  | PermissionGroupCode
  | null

export type Permission = {
  groupLabel: string
  codeLabel: string
  value: PermissionGroupCode
  guards: PermissionGuard[]
}

type AdditionalPermissionCode = 'import'

type PermissionsHelper = {
  label: string
  group: PermissionGroup
  additional?: AdditionalPermissionCode[]
  partial?: boolean
}

type CodeHelper = {
  label: string
  code: PermissionCode
  guards: PermissionGuard[]
}

export const extractPermission = (
  permission: PermissionGroupCode,
): {
  group: PermissionGroup
  code: PermissionCode
} => {
  const [group, code] = permission.split(SEPARATOR) as [
    PermissionGroup,
    PermissionCode,
  ]

  return { group, code }
}

export const concatPermission = (
  group: PermissionGroup,
  code: PermissionCode,
): PermissionGroupCode => {
  return (group + SEPARATOR + code) as PermissionGroupCode
}

export const checkPermission = (
  {
    permission,
    guard,
  }: {
    permission: PermissionGroupCode
    guard: PermissionGuard
  },
  permissions: PrismaPermission[],
): boolean => {
  for (const item of permissions) {
    const { group, code } = extractPermission(permission)

    if (item.group === group && item.code === code && item.guard === guard) {
      return true
    }
  }

  return false
}

export const checkNavigationPermission = (
  groups: PermissionGroup[] | undefined,
  permissions: PrismaPermission[],
) => {
  if (!groups) return true

  return groups.some((group) => {
    return permissions.some((permission) => {
      return (
        permission.group === group &&
        permission.code === 'navigate' &&
        permission.guard === 'component'
      )
    })
  })
}

const handlePermissionsHelper = () => {
  const permissions: Permission[] = []

  for (const {
    label: groupLabel,
    group,
    additional,
    partial,
  } of permissionsHelper) {
    const codes: CodeHelper[] = [
      {
        label: 'Listar',
        code: 'list',
        guards: ['action', 'page'],
      },
      {
        label: 'Visualizar',
        code: 'view',
        guards: partial
          ? ['action', 'component']
          : ['action', 'page', 'component'],
      },
      {
        label: 'Criar',
        code: 'create',
        guards: partial
          ? ['action', 'component']
          : ['action', 'page', 'component'],
      },
      {
        label: 'Editar',
        code: 'update',
        guards: partial
          ? ['action', 'component']
          : ['action', 'page', 'component'],
      },
      {
        label: 'Excluir',
        code: 'delete',
        guards: ['action', 'component'],
      },
      {
        label: 'Navegar',
        code: 'navigate',
        guards: ['component'],
      },
    ]

    if (additional?.includes('import')) {
      codes.push({
        label: 'Importar',
        code: 'import',
        guards: ['action', 'component'],
      })
    }

    for (const { label: codeLabel, code, guards } of codes) {
      const value = concatPermission(group, code)

      permissions.push({ groupLabel, codeLabel, value, guards })
    }
  }

  return permissions
}

/**
 * Permissions helper, used to create permissions
 * @type {DefinedPermission[]}
 */
export const permissionsHelper: PermissionsHelper[] = [
  {
    label: 'Viagem',
    group: 'trip',
  },
  {
    label: 'Motorista',
    group: 'driver',
    additional: ['import'],
  },
  {
    label: 'Agregado',
    group: 'aggregate',
    additional: ['import'],
  },
  {
    label: 'Cliente',
    group: 'client',
    additional: ['import'],
  },
  {
    label: 'Unidade',
    group: 'unit',
    additional: ['import'],
  },
  {
    label: 'Caminhão',
    group: 'truck',
    additional: ['import'],
  },
  {
    label: 'Semirreboque',
    group: 'semiTrailer',
    additional: ['import'],
  },

  {
    label: 'Agrupamento',
    group: 'grouping',
    partial: true,
  },
  {
    label: 'A.S.O. de motorista',
    group: 'aso',
    partial: true,
  },
  {
    label: 'Ausência de motorista',
    group: 'absentDriver',
    partial: true,
  },
  {
    label: 'Configuração de reboque',
    group: 'trailerConfiguration',
    partial: true,
  },
  {
    label: 'Tipo de reboque',
    group: 'trailerType',
    partial: true,
  },
  {
    label: 'Carga',
    group: 'cargo',
    partial: true,
  },
  {
    label: 'Laudo de reboque',
    group: 'trailerCertificate',
    partial: true,
  },
  {
    label: 'Parada de veículo',
    group: 'stoppedVehicle',
    partial: true,
  },
  {
    label: 'Marca',
    group: 'brand',
    partial: true,
  },

  {
    label: 'Usuário',
    group: 'user',
    partial: true,
  },
  {
    label: 'Grupo',
    group: 'group',
    partial: true,
  },
  {
    label: 'Função',
    group: 'role',
    partial: true,
  },
]

/**
 * Permissions
 * @type {Permission[]}
 */
export const permissions: Permission[] = handlePermissionsHelper().concat([
  {
    groupLabel: 'Viagem',
    codeLabel: 'Editar Status',
    value: 'trip.updateStatus',
    guards: ['action', 'component'],
  },

  {
    groupLabel: 'MDF-e',
    codeLabel: 'Gerenciar',
    value: 'mdfe.view',
    guards: ['action', 'page'],
  },
  {
    groupLabel: 'MDF-e',
    codeLabel: 'Navegar',
    value: 'mdfe.navigate',
    guards: ['component'],
  },

  {
    groupLabel: 'Permissão',
    codeLabel: 'Listar',
    value: 'permission.list',
    guards: ['action', 'page'],
  },
  {
    groupLabel: 'Permissão',
    codeLabel: 'Navegar',
    value: 'permission.navigate',
    guards: ['component'],
  },
])

export type PermissionByGroup = {
  groupLabel: string
  guards: Record<PermissionGuard, Pick<Permission, 'codeLabel' | 'value'>[]>
}

export const permissionsByGroup = permissions.reduce(
  (acc: PermissionByGroup[], item) => {
    const { groupLabel, guards, ...permission } = item
    const group = acc.find((group) => group.groupLabel === groupLabel)

    if (group) {
      guards.forEach((guard) => {
        if (!group.guards[guard]) group.guards[guard] = []

        group.guards[guard].push(permission)
      })
    } else {
      const newGroup: PermissionByGroup = {
        groupLabel,
        guards: { action: [], page: [], component: [] },
      }

      guards.forEach((guard) => newGroup.guards[guard].push(permission))

      acc.push(newGroup)
    }

    return acc
  },
  [],
)

export const guardLabels = {
  action: 'Ações',
  page: 'Páginas',
  component: 'Componentes',
}
