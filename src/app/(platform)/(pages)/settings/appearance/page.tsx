'use client'

import { AppearanceForm } from '@/components/forms/appearance-form'
import { Separator } from '@/components/ui/separator'
import { usePageWidth } from '@/store/use-page-width'
import { useTheme } from 'next-themes'

export default function Page() {
  const theme = useTheme().theme as 'system' | 'light' | 'dark'
  const width = usePageWidth().width

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
