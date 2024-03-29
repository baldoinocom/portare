import {
  shieldAction as shield,
  shieldPartialAction,
} from '@/lib/shield-action'
import { PermissionGroupCode } from '@/permissions'
import { createAction } from './create'
import { createDraftAction } from './create-draft'
import { deleteAction } from './delete'
import { findAction } from './find'
import { findManyAction } from './find-many'
import { updateAction } from './update'
import { updateDraftAction } from './update-draft'
import { updateStatusAction } from './update-status'

export const tripAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'trip.create',
      overwriter,
    }),

    createDraft: shield({
      action: createDraftAction,
      permission: 'trip.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'trip.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'trip.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'trip.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'trip.update',
      overwriter,
    }),

    updateDraft: shield({
      action: updateDraftAction,
      permission: 'trip.update',
      overwriter,
    }),

    updateStatus: shield({
      action: updateStatusAction,
      permission: 'trip.updateStatus',
      overwriter,
    }),
  }

  return actions
}
