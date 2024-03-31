'use client'

import { Shield } from '@/components/shield'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Edit3Icon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const EditButton = () => {
  const pathname = usePathname()

  const editing = pathname.match(/\/edit$/)

  const redirectEdit = pathname + '/edit'

  return (
    <Shield permission="truck.update">
      <Button variant="outline" className={cn(editing && 'sr-only')} asChild>
        <Link href={redirectEdit}>
          <Edit3Icon className="mr-2 size-4" />
          Editar
        </Link>
      </Button>
    </Shield>
  )
}
