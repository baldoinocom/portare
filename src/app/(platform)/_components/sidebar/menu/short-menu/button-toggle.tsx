'use client'

import { Button } from '@/components/ui/button'
import { useSidebar } from '@/store/use-sidebar'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export const ButtonToggle = () => {
  const { collapsed, onExpand, onCollapse } = useSidebar()

  return (
    <>
      {collapsed ? (
        <Button
          variant="outline"
          size="sm"
          className="m-0 scale-0 group-hover:scale-100"
          onClick={onExpand}
        >
          <ArrowRight size={12} />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="ml-auto scale-0 group-hover:scale-100"
          onClick={onCollapse}
        >
          <ArrowLeft size={12} />
        </Button>
      )}
    </>
  )
}
