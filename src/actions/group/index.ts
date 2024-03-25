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

export const groupAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'group.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'group.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'group.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'group.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'group.update',
      overwriter,
    }),
  }

  return actions
}
