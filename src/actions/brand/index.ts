import { findAction } from './find'
import { findManyAction } from './find-many'

export const brandAction = () => {
  return {
    find: findAction,
    findMany: findManyAction,
  }
}
