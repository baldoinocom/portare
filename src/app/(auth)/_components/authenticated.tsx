import { PageContent } from '@/components/page-content'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const Authenticated = () => {
  return (
    <div className="flex min-h-full flex-col bg-background pb-12 pt-16">
      <PageContent className="w-full flex-grow justify-center gap-y-0 px-6">
        <main className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">Oops</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Autenticado
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Não é possível acessar esta página enquanto autenticado
            </p>
            <div className="mt-6">
              <Button
                variant="ghost"
                className="text-base font-medium text-primary"
                asChild
              >
                <Link href="/">
                  Ir para o início
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
