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

export const asoAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'aso.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'aso.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'aso.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'aso.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'aso.update',
      overwriter,
    }),
  }

  return actions
}
