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

export const brandAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'brand.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'brand.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'brand.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'brand.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'brand.update',
      overwriter,
    }),
  }

  return actions
}
