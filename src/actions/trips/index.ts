import { createAction } from './create'
import { createDraftAction } from './create-draft'
import { deleteAction } from './delete'
import { findAction } from './find'
import { findManyAction } from './find-many'
import { updateAction } from './update'

export const tripAction = () => {
  return {
    create: createAction,
    createDraft: createDraftAction,
    delete: deleteAction,
    find: findAction,
    findMany: findManyAction,
    update: updateAction,
  }
}
