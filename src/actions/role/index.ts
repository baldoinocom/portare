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

export const roleAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'role.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'role.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'role.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'role.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'role.update',
      overwriter,
    }),
  }

  return actions
}
