import { PageContent } from '@/components/page-content'
import { Separator } from '@/components/ui/separator'
import { SidebarNav } from './_components/sidebar-nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageContent>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie as informações do seu perfil e as configurações da sua conta
        </p>
      </div>

      <Separator />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="w-full snap-x overflow-x-auto lg:w-1/5">
          <SidebarNav />
        </aside>

        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </PageContent>
  )
}
