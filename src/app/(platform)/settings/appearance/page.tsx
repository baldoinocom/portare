'use client'

import { Separator } from '@/components/ui/separator'
import { useTheme } from 'next-themes'
import { AppearanceForm } from './appearance-form'

export default function Page() {
  const { theme } = useTheme()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Aparência</h3>
        <p className="text-sm text-muted-foreground">
          Personalize a aparência do aplicativo
        </p>
      </div>

      <Separator />

      {theme && (
        <AppearanceForm initialData={{ theme: theme as 'dark' | 'light' }} />
      )}
    </div>
  )
}
