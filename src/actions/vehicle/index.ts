import { createAction } from './create'
import { deleteAction } from './delete'
import { deleteManyAction } from './delete-many'
import { findManyAction } from './find-many'
import { updateAction } from './update'

export const vehicleAction = () => {
  return {
    create: createAction,
    delete: deleteAction,
    deleteMany: deleteManyAction,
    findMany: findManyAction,
    update: updateAction,
  }
}
