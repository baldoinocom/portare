import { Breadcrumb, BreadcrumbProps } from '@/components/breadcrumb'

const pages: BreadcrumbProps[] = [
  { name: 'Clientes', href: '/clients' },
  { name: 'Cadastro' },
]

export const Header = () => {
  return (
    <div>
      <Breadcrumb pages={pages} />

      <div className="mt-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
            Cadastro do cliente
          </h2>
        </div>
      </div>
    </div>
  )
}
