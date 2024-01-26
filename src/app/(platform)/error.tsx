'use client'

import { Button } from '@/components/ui/button'

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-full flex-col bg-background pb-12 pt-16">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-base font-semibold text-primary">Oops</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Ocorreu um erro
            </h1>
            <p className="mt-2 text-base text-muted-foreground">
              Lamentamos, mas ocorreu um erro inesperado
            </p>
            <div className="mt-6">
              <Button
                variant="ghost"
                className="text-base font-medium text-primary"
                onClick={reset}
              >
                Voltar para início
                <span> &rarr;</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
