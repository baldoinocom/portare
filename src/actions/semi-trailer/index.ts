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

export const semiTrailerAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'semiTrailer.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'semiTrailer.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'semiTrailer.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'semiTrailer.list',
      overwriter,
    }),

    importMany: shield({
      action: importManyAction,
      permission: 'semiTrailer.import',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'semiTrailer.update',
      overwriter,
    }),
  }

  return actions
}
