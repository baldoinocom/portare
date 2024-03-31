import { shieldPartialAction } from '@/lib/shield-action'
import { PermissionOverwriter } from '@/permissions'
import { checkUserAction } from './check-user'
import { findManyAction } from './find-many'

export const permissionAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    checkUser: checkUserAction,

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'permission.list',
      overwriter,
    }),
  }

  return actions
}
