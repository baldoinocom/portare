import { findAction } from './find'
import { findManyAction } from './find-many'

export const trailerConfigurationAction = () => {
  return {
    find: findAction,
    findMany: findManyAction,
  }
}
