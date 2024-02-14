import { Separator } from '@/components/ui/separator'
import { SidebarNav } from './_components/sidebar-nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Sistema</h2>
        <p className="text-muted-foreground">
          Controle de usuários, grupos e permissões
        </p>
      </div>

      <Separator />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="w-full snap-x overflow-x-auto lg:w-1/5">
          <SidebarNav />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  )
}
