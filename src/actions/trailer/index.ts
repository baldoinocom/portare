import {
  shieldAction as shield,
  shieldPartialAction,
} from '@/lib/shield-action'
import { PermissionGroupCode } from '@/permissions'
import { findAction } from './find'
import { findExistingTrailerAction } from './find-existing-trailer'
import { findManyAction } from './find-many'

export const trailerAction = ({
  overwriter,
}: { overwriter?: PermissionGroupCode | null } = {}) => {
  const actions = {
    find: shield({
      action: findAction,
      overwriter,
    }),

    findExistingTrailer: shield({
      action: findExistingTrailerAction,
      overwriter,
    }),

    findMany: shieldPartialAction({
      action: findManyAction,
      overwriter,
    }),
  }

  return actions
}
