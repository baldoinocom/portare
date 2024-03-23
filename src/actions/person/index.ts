import { shieldAction as shield } from '@/lib/shield-action'
import { PermissionGroupCode } from '@/permissions'
import { createAction } from './create'
import { createWithoutRelationshipAction } from './create-without-relationship'
import { deleteAction } from './delete'
import { updateAction } from './update'

export const personAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    create: shield({
      action: createAction,
      overwriter,
    }),

    createWithoutRelationship: shield({
      action: createWithoutRelationshipAction,
      overwriter,
    }),

    delete: shield({
      action: deleteAction,
      overwriter,
    }),

    update: shield({
      action: updateAction,
      overwriter,
    }),
  }

  return actions
}
