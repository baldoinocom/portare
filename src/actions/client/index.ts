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

export const clientAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'client.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'client.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'client.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'client.list',
      overwriter,
    }),

    importMany: shield({
      action: importManyAction,
      permission: 'client.import',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'client.update',
      overwriter,
    }),
  }

  return actions
}
