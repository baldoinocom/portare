import { deleteAction } from '../trips/delete'
import { createAction } from './create'
import { findAction } from './find'
import { findManyAction } from './find-many'
import { updateAction } from './update'

export const truckAction = () => {
  return {
    create: createAction,
    delete: deleteAction,
    find: findAction,
    findMany: findManyAction,
    update: updateAction,
  }
}
