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

export const absentDriverAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'absentDriver.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'absentDriver.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'absentDriver.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'absentDriver.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'absentDriver.update',
      overwriter,
    }),
  }

  return actions
}
