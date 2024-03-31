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

export const aggregateAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'aggregate.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'aggregate.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'aggregate.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'aggregate.list',
      overwriter,
    }),

    importMany: shield({
      action: importManyAction,
      permission: 'aggregate.import',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'aggregate.update',
      overwriter,
    }),
  }

  return actions
}
