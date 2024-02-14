import { Breadcrumb, BreadcrumbProps } from '@/components/breadcrumb'
import { Separator } from '@/components/ui/separator'

const pages: BreadcrumbProps[] = [
  { name: 'Caminhões', href: '/trucks' },
  { name: 'Cadastro' },
]

export const Header = () => {
  return (
    <div className="sticky top-16 z-50 -mt-10 space-y-8 bg-background pt-10">
      <div>
        <Breadcrumb pages={pages} />

        <div className="mt-2">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
              Cadastro do caminhão
            </h2>
          </div>
        </div>
      </div>

      <Separator />
    </div>
  )
}
