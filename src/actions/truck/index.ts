import { createAction } from './create'
import { deleteAction } from './delete'
import { findAction } from './find'
import { findManyAction } from './find-many'

export const truckAction = {
  create: createAction,
  delete: deleteAction,
  find: findAction,
  findMany: findManyAction,
}
