import { PageContent } from '@/components/page-content'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function Unauthorized() {
  return (
    <div className="flex min-h-full flex-col bg-background pb-12 pt-16">
      <PageContent className="w-full flex-grow justify-center gap-y-0 px-6">
        <main className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">Oops</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Não autorizado
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Você não tem permissão para acessar essa página
            </p>
            <div className="mt-6">
              <Button
                variant="ghost"
                className="text-base font-medium text-primary"
                asChild
              >
                <Link href="/">
                  Voltar para início
                  <span> &rarr;</span>
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </PageContent>
    </div>
  )
}
