import { findAction } from './find'
import { findManyAction } from './find-many'

export const groupingAction = () => {
  return {
    find: findAction,
    findMany: findManyAction,
  }
}
