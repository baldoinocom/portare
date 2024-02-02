import { action } from '@/actions'
import { GroupingFormDialog } from '@/components/forms/form-dialogs/grouping-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Dialog } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Header } from './header'
import { Main } from './main'

export const Groupings = async () => {
  const [groupings, drivers, trucks, semiTrailers] = await Promise.all([
    action.grouping().findMany(),
    action.driver().findMany(),
    action.truck().findMany(),
    action.semiTrailer().findMany(),
  ])

  return (
    <Dialog>
      <Header />

      <Separator />

      <Main
        groupings={groupings.data}
        drivers={drivers.data}
        trucks={trucks.data}
        semiTrailers={semiTrailers.data}
      />

      <FormDialogContent>
        <GroupingFormDialog
          drivers={drivers.data}
          trucks={trucks.data}
          semiTrailers={semiTrailers.data}
        />
      </FormDialogContent>
    </Dialog>
  )
}
