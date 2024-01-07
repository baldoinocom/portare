import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function DataNotFound() {
  return (
    <div className="flex min-h-full flex-col bg-background pb-12 pt-16">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">404</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Dados não encontrado
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Lamentamos, mas não conseguimos encontrar os dados que procura
            </p>
            <div className="mt-6">
              <Button variant="ghost">
                <Link href="/" className="text-base font-medium text-primary">
                  Voltar para início
                  <span> &rarr;</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-12 pt-16">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">404</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Página não encontrada
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Lamentamos, mas não conseguimos encontrar a página que procura
            </p>
            <div className="mt-6">
              <Button variant="ghost">
                <Link href="/" className="text-base font-medium text-primary">
                  Voltar para início
                  <span> &rarr;</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
