import { createAction } from './create'
import { deleteAction } from './delete'
import { updateAction } from './update'

export const vehicleAction = {
  create: createAction,
  update: updateAction,
  delete: deleteAction,
}
