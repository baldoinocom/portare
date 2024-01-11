import { findAction } from './find'
import { findManyAction } from './find-many'

export const trailerTypeAction = () => {
  return {
    find: findAction,
    findMany: findManyAction,
  }
}
