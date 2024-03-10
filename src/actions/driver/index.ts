import { createAction } from './create'
import { deleteAction } from './delete'
import { findAction } from './find'
import { findManyAction } from './find-many'
import { importManyAction } from './import-many'
import { updateAction } from './update'

export const driverAction = () => {
  return {
    create: createAction,
    delete: deleteAction,
    find: findAction,
    findMany: findManyAction,
    importMany: importManyAction,
    update: updateAction,
  }
}
