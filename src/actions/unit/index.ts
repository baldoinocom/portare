import {
  shieldAction as shield,
  shieldPartialAction,
} from '@/lib/shield-action'
import { PermissionGroupCode } from '@/permissions'
import { createAction } from './create'
import { deleteAction } from './delete'
import { findAction } from './find'
import { findManyAction } from './find-many'
import { importManyAction } from './import-many'
import { updateAction } from './update'

export const unitAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'unit.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'unit.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'unit.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'unit.list',
      overwriter,
    }),

    importMany: shield({
      action: importManyAction,
      permission: 'unit.import',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'unit.update',
      overwriter,
    }),
  }

  return actions
}
