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

export const driverAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'driver.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'driver.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'driver.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'driver.list',
      overwriter,
    }),

    importMany: shield({
      action: importManyAction,
      permission: 'driver.import',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'driver.update',
      overwriter,
    }),
  }

  return actions
}
