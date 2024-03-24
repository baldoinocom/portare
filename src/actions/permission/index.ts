import { shieldPartialAction } from '@/lib/shield-action'
import { PermissionGroupCode } from '@/permissions'
import { findManyAction } from './find-many'

export const permissionAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'permission.list',
      overwriter,
    }),
  }

  return actions
}
