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

export const cargoAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'cargo.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'cargo.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'cargo.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'cargo.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'cargo.update',
      overwriter,
    }),
  }

  return actions
}
