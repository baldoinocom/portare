'use client'

import { AppearanceForm } from '@/components/forms/appearance-form'
import { PageWidthContext } from '@/components/page-content'
import { Separator } from '@/components/ui/separator'
import { useTheme } from 'next-themes'
import { UseThemeProps } from 'next-themes/dist/types'
import * as React from 'react'

export default function Page() {
  const theme = useTheme().theme as UseThemeProps['systemTheme']
  const width = React.useContext(PageWidthContext).width

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Aparência</h3>
        <p className="text-sm text-muted-foreground">
          Personalize a aparência do aplicativo
        </p>
      </div>

      <Separator />

      {theme && width && <AppearanceForm initialData={{ theme, width }} />}
    </div>
  )
}
