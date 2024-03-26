'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, useFormField } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  extractPermission,
  guardLabels,
  PermissionGroupCode,
  permissionsByGroup,
} from '@/permissions'
import { Permission, PermissionGroup, PermissionGuard } from '@prisma/client'
import * as React from 'react'
import { useFormContext } from 'react-hook-form'

type PermissionSelect = Pick<Permission, 'group' | 'code' | 'guard'>

export const PermissionCheck = () => {
  const { getValues, setValue } = useFormContext()
  const { name } = useFormField()

  const [permissionsSelected, setPermissionsSelected] = React.useState<
    PermissionSelect[]
  >([])

  React.useEffect(() => {
    const permissions = getValues(name) as PermissionSelect[]

    if (permissions) {
      setPermissionsSelected(permissions)
    }
  }, [getValues, name])

  const onChangeGuard = (
    value: boolean | 'indeterminate',
    groupLabel: string,
    group: PermissionGroup,
    guard: PermissionGuard,
  ) => {
    const permissions = permissionsByGroup.find(
      (permission) => permission.groupLabel === groupLabel,
    )

    if (permissions) {
      setPermissionsSelected((prev) => {
        let values = []

        if (!value || value === 'indeterminate') {
          const newPermissions = prev.filter(
            (p) => p.group !== group || p.guard !== guard,
          )

          values = newPermissions
        } else {
          const newPermissions = permissions.guards[guard]
            .map(({ value }) => {
              const { group, code } = extractPermission(value)

              const exists = prev.some(
                (p) =>
                  p.group === group && p.code === code && p.guard === guard,
              )

              return !exists ? { group, code, guard } : null
            })
            .filter(Boolean) as PermissionSelect[]

          values = prev.concat(newPermissions)
        }

        setValue(name, values)
        return values
      })
    }
  }

  const onChangePermission = (
    value: boolean,
    permission: PermissionGroupCode,
    guard: PermissionGuard,
  ) => {
    const { group, code } = extractPermission(permission)

    setPermissionsSelected((prev) => {
      let values = []

      if (value) {
        values = prev.concat({ group, code, guard })
      } else {
        values = prev.filter(
          (p) => p.group !== group || p.code !== code || p.guard !== guard,
        )
      }

      setValue(name, values)
      return values
    })
  }

  const guardSelected = (
    groupLabel: string,
    group: PermissionGroup,
    guard: PermissionGuard,
  ): boolean | 'indeterminate' => {
    const permission = permissionsSelected.filter(
      (p) => p.group === group && p.guard === guard,
    )

    const guards = permissionsByGroup.find((p) => p.groupLabel === groupLabel)
      ?.guards

    if (guards) {
      const permissions = guards[guard]

      if (permission.length) {
        if (permission.length < permissions.length) {
          return 'indeterminate'
        } else {
          return true
        }
      }
    }

    return false
  }

  const permissionSelected = (
    permission: PermissionGroupCode,
    guard: PermissionGuard,
  ): boolean => {
    const { group, code } = extractPermission(permission)

    return permissionsSelected.some(
      (p) => p.group === group && p.code === code && p.guard === guard,
    )
  }

  return (
    <FormControl>
      <ScrollArea className="h-96">
        <div className="space-y-6">
          {permissionsByGroup.map(({ groupLabel, guards }, index) => {
            const [{ value }] = Object.values(guards).map(([guard]) => guard)
            const { group } = extractPermission(value)

            return (
              <div key={index} className="space-y-2 border-b pb-6">
                <Label className="text-base font-semibold">{groupLabel}</Label>

                <div className="ms-2 space-y-4">
                  {Object.entries(guards).map(
                    ([guard, permissions], index) =>
                      !!permissions.length && (
                        <div key={index} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${group}:${guard}`}
                              checked={guardSelected(
                                groupLabel,
                                group,
                                guard as PermissionGuard,
                              )}
                              onCheckedChange={(
                                value: boolean | 'indeterminate',
                              ) =>
                                onChangeGuard(
                                  value,
                                  groupLabel,
                                  group,
                                  guard as PermissionGuard,
                                )
                              }
                            />

                            <Label
                              htmlFor={`${group}:${guard}`}
                              className="font-semibold"
                            >
                              {guardLabels[guard as PermissionGuard]}
                            </Label>
                          </div>

                          <div className="ms-2 grid grid-cols-3 gap-2">
                            {permissions.map(
                              ({ codeLabel, value: permission }, index) => (
                                <div
                                  key={index}
                                  className="flex items-center space-x-2"
                                >
                                  <Checkbox
                                    id={`${permission}:${guard}`}
                                    checked={permissionSelected(
                                      permission,
                                      guard as PermissionGuard,
                                    )}
                                    onCheckedChange={(value: boolean) =>
                                      onChangePermission(
                                        value,
                                        permission,
                                        guard as PermissionGuard,
                                      )
                                    }
                                  />

                                  <Label htmlFor={`${permission}:${guard}`}>
                                    {codeLabel}
                                  </Label>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </FormControl>
  )
}
