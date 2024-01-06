import { createAction } from './create'
import { createWithoutRelationshipAction } from './create-without-relationship'
import { deleteAction } from './delete'
import { updateAction } from './update'

export const personAction = {
  create: createAction,
  createWithoutRelationship: createWithoutRelationshipAction,
  update: updateAction,
  delete: deleteAction,
}
