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

export const trailerCertificateAction = ({
  overwriter,
}: {
  overwriter?: PermissionOverwriter
} = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      permission: 'trailerCertificate.create',
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      permission: 'trailerCertificate.delete',
      overwriter,
    }),

    find: shield({
      action: findAction,
      permission: 'trailerCertificate.view',
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      permission: 'trailerCertificate.list',
      overwriter,
    }),

    update: shield({
      action: updateAction,
      permission: 'trailerCertificate.update',
      overwriter,
    }),
  }

  return actions
}
