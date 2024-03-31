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

export const groupingAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'grouping.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'grouping.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'grouping.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'grouping.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'grouping.update',
      overwriter,
    }),
  }

  return actions
}
