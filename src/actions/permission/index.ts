import { shieldPartialAction } from '@/lib/shield-action'
import { PermissionGroupCode } from '@/permissions'
import { checkAction } from './check'
import { findManyAction } from './find-many'
import { listAction } from './list'

export const permissionAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    check: checkAction,

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'permission.list',
      overwriter,
    }),

    list: listAction,
  }

  return actions
}
