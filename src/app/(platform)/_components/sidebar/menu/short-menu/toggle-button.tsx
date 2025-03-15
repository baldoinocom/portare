'use client'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/store/use-sidebar'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const ToggleButton = () => {
  const { collapsed, onExpand, onCollapse } = useSidebar()

  return (
    <>
      {collapsed ? (
        <Button
          variant="outline"
          size="sm"
          className="mx-auto size-8 scale-0 p-0 group-hover:scale-100"
          onClick={onExpand}
        >
          <ArrowRight className="size-3" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="ml-auto size-8 scale-0 p-0 group-hover:scale-100"
          onClick={onCollapse}
        >
          <ArrowLeft className="size-3" />
        </Button>
      )}
    </>
  )
}
