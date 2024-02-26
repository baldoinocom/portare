import { PageContent } from '@/components/page-content'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  CalendarCheck2Icon,
  CalendarCheckIcon,
  CalendarClockIcon,
  CalendarDaysIcon,
} from 'lucide-react'

export default function Page() {
  return (
    <PageContent>
      <header>
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
              Início
            </h2>
          </div>
        </div>
      </header>

      <Separator />

      <main className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progamados</CardTitle>

              <CalendarDaysIcon className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">+0</div>
              <p className="text-xs text-muted-foreground">
                +0,0% do mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Em progresso
              </CardTitle>

              <CalendarClockIcon className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">+0</div>
              <p className="text-xs text-muted-foreground">
                +0,0% do mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizados</CardTitle>

              <CalendarCheckIcon className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">+0</div>
              <p className="text-xs text-muted-foreground">
                +0,0% do mês passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>

              <CalendarCheck2Icon className="size-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">+0</div>
              <p className="text-xs text-muted-foreground">
                +0,0% do mês passado
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          {/* Content */}
        </div>
      </main>
    </PageContent>
  )
}
