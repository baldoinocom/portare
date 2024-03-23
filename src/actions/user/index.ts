import {
  shieldAction as shield,
  shieldPartialAction,
} from '@/lib/shield-action'
import { PermissionGroupCode } from '@/permissions'
import { createAction } from './create'
import { deleteAction } from './delete'
import { findAction } from './find'
import { findManyAction } from './find-many'
import { updateAction } from './update'
import { updatePasswordAction } from './update-password'

export const userAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'user.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'user.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'user.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'user.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'user.update',
      overwriter,
    }),

    updatePassword: shield({
      action: updatePasswordAction,
      overwriter,
    }),
  }

  return actions
}
