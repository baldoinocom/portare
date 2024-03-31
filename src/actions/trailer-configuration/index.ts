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

export const trailerConfigurationAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'trailerConfiguration.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'trailerConfiguration.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'trailerConfiguration.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'trailerConfiguration.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'trailerConfiguration.update',
      overwriter,
    }),
  }

  return actions
}
