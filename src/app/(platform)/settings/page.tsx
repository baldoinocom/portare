import { Separator } from '@/components/ui/separator'
import { ProfileForm } from './profile-form'

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-muted-foreground">
          É assim que os outros verão você no site
        </p>
      </div>

      <Separator />

      <ProfileForm />
    </div>
  )
}
