import { createAction } from './create'
import { deleteAction } from './delete'
import { findAction } from './find'
import { findManyAction } from './find-many'
import { updateAction } from './update'
import { updateDocumentAction } from './update-document'

export const aggregateAction = () => {
  return {
    create: createAction,
    delete: deleteAction,
    find: findAction,
    findMany: findManyAction,
    update: updateAction,
    updateDocument: updateDocumentAction,
  }
}
