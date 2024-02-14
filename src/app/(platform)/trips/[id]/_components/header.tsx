'use client'

import { Breadcrumb, BreadcrumbProps } from '@/components/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Edit3Icon } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const pages: BreadcrumbProps[] = [
  { name: 'Viagens', href: '/trips' },
  { name: 'Registro' },
]

export const Header = () => {
  const searchParams = useSearchParams()

  const edit = searchParams.get('edit') !== null

  return (
    <div className="sticky top-16 z-50 -mt-10 space-y-8 bg-background pt-10">
      <div>
        <Breadcrumb pages={pages} />

        <div className="mt-2">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold sm:truncate sm:text-3xl sm:tracking-tight">
                Registro da viagem
              </h2>
            </div>

            <div className="mt-3 space-x-2 sm:ml-4 sm:mt-0">
              <Button variant="outline" asChild>
                {!edit && (
                  <Link href={{ query: 'edit' }}>
                    <Edit3Icon className="mr-2 size-4" />
                    Editar
                  </Link>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Separator />
    </div>
  )
}
