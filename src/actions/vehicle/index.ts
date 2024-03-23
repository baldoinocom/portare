import {
  shieldAction as shield,
  shieldPartialAction,
} from '@/lib/shield-action'
import { PermissionGroupCode } from '@/permissions'
import { createAction } from './create'
import { deleteAction } from './delete'
import { deleteManyAction } from './delete-many'
import { findManyAction } from './find-many'
import { updateAction } from './update'

export const vehicleAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      overwriter,
    }),

    deleteMany: shield({
      action: deleteManyAction,
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      overwriter,
    }),

    update: shield({
      action: updateAction,
      overwriter,
    }),
  }

  return actions
}
