import { createAction } from './create'
import { deleteAction } from './delete'
import { findManyAction } from './find-many'
import { updateAction } from './update'

export const vehicleAction = () => {
  return {
    create: createAction,
    update: updateAction,
    findMany: findManyAction,
    delete: deleteAction,
  }
}
