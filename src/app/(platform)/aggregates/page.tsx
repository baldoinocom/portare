'use client'

import { EmptyState } from '@/components/empty-state'
import { Separator } from '@/components/ui/separator'
import { BuildingIcon } from 'lucide-react'
import { Header } from './_components/header'

export default function Page() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
      <Header />

      <Separator />

      <main>
        <div className="flex flex-col gap-y-8">
          <EmptyState href="/aggregates/new">
            <BuildingIcon
              strokeWidth={1.2}
              size={52}
              className="mx-auto text-muted-foreground"
            />

            <span className="mt-2 block text-sm font-semibold">
              Cadastrar um novo agregado
            </span>
          </EmptyState>
        </div>
      </main>
    </div>
  )
}
