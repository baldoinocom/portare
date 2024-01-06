import { findAction } from './find'
import { findExistingTrailerAction } from './find-existing-trailer'
import { findManyAction } from './find-many'

export const trailerAction = () => {
  return {
    find: findAction,
    findExistingTrailer: findExistingTrailerAction,
    findMany: findManyAction,
  }
}
