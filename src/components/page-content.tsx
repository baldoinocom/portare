'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

export type PageContentProps = React.HTMLAttributes<HTMLDivElement>

export type Width = 'flexible' | 'full'

export type PageWidth = {
  width: Width | undefined
  setWidth: (value: Width) => void
}

export const PageWidthContext = React.createContext({} as PageWidth)

const KEY = 'page-width'

export const PageContent = ({ className, ...props }: PageContentProps) => {
  const [width, setWidth] = React.useState<Width>()

  React.useEffect(() => {
    setWidth((localStorage.getItem(KEY) || 'flexible') as Width)
  }, [])

  return (
    <PageWidthContext.Provider
      value={{
        width,
        setWidth: (value) => {
          localStorage.setItem(KEY, value)
          setWidth(value)
        },
      }}
    >
      <div
        className={cn(
          'mx-auto flex flex-col gap-y-8 px-4 py-10 sm:px-6 lg:px-8',
          width === 'full' ? 'w-full' : 'max-w-7xl',
          className,
        )}
        {...props}
      />
    </PageWidthContext.Provider>
  )
}
