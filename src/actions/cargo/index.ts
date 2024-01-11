import { findAction } from './find'
import { findManyAction } from './find-many'

export const cargoAction = () => {
  return {
    find: findAction,
    findMany: findManyAction,
  }
}
