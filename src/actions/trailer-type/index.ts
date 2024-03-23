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

export const trailerTypeAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'trailerType.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'trailerType.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'trailerType.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'trailerType.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'trailerType.update',
      overwriter,
    }),
  }

  return actions
}
