import { action } from '@/actions'
import { GroupingFormDialog } from '@/components/forms/form-dialogs/grouping-form-dialog'
import { FormDialogContent } from '@/components/forms/ui/form-dialog-content'
import { Shield } from '@/components/shield'
import { Dialog } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Header } from './header'
import { Main } from './main'

export const Groupings = async () => {
  const [groupings, drivers, trucks, semiTrailers] = await Promise.all([
    action.grouping().findMany(),
    action.driver({ overwriter: 'grouping.list' }).findMany(),
    action.truck({ overwriter: 'grouping.list' }).findMany(),
    action.semiTrailer({ overwriter: 'grouping.list' }).findMany(),
  ])

  return (
    <Shield page permission="grouping.list">
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
    </Shield>
  )
}
