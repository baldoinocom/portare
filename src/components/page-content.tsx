'use client'

import { cn } from '@/lib/utils'
import { usePageWidth, Width } from '@/store/use-page-width'
import * as React from 'react'

type PageContentProps = React.HTMLAttributes<HTMLDivElement>

const KEY = 'page-width'

export const PageContent = ({ className, ...props }: PageContentProps) => {
  const { width, setWidth } = usePageWidth()

  React.useEffect(() => {
    setWidth((localStorage.getItem(KEY) || 'flexible') as Width)
  }, [setWidth])

  React.useEffect(() => {
    if (width) localStorage.setItem(KEY, String(width))
  }, [width])

  return (
    <div
      className={cn(
        'mx-auto flex flex-col gap-y-4 px-4 py-10 sm:px-6 lg:px-8',
        width === 'full' ? 'w-full' : 'max-w-7xl',
        className,
      )}
      {...props}
    />
  )
}
