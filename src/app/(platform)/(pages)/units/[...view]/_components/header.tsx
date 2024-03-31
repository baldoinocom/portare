import { Breadcrumb, BreadcrumbProps } from '@/components/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { EditButton } from './edit-button'

const pages: BreadcrumbProps[] = [
  { name: 'Unidades', href: '/units' },
  { name: 'Cadastro' },
]

export const Header = () => {
  return (
    <div className="sticky top-16 z-10 -mt-10 space-y-8 bg-background pt-10">
      <div>
        <Breadcrumb pages={pages} />

        <div className="mt-2">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
                Cadastro da unidade
              </h2>
            </div>

            <div className="mt-3 space-x-2 sm:ml-4 sm:mt-0">
              <EditButton />
            </div>
          </div>
        </div>
      </div>

      <Separator />
    </div>
  )
}
