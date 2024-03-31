import {
  shieldAction as shield,
  shieldPartialAction,
} from '@/lib/shield-action'
import { PermissionOverwriter } from '@/permissions'
import { createAction } from './create'
import { deleteAction } from './delete'
import { findAction } from './find'
import { findManyAction } from './find-many'
import { updateAction } from './update'

export const stoppedVehicleAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'stoppedVehicle.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'stoppedVehicle.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'stoppedVehicle.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'stoppedVehicle.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'stoppedVehicle.update',
      overwriter,
    }),
  }

  return actions
}
