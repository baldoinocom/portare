import {
  shieldAction as shield,
  shieldPartialAction,
} from '@/lib/shield-action'
import { PermissionOverwriter } from '@/permissions'
import { createAction } from './create'
import { deleteAction } from './delete'
import { findAction } from './find'
import { findManyAction } from './find-many'
import { importManyAction } from './import-many'
import { updateAction } from './update'

export const truckAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'truck.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'truck.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'truck.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'truck.list',
      overwriter,
    }),

    importMany: shield({
      action: importManyAction,
      permission: 'truck.import',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'truck.update',
      overwriter,
    }),
  }

  return actions
}
