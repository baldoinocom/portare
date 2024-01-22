import { Separator } from '@/components/ui/separator'
import { currentUser } from '@/lib/auth-service'
import { ProfileForm } from './profile-form'

export default async function Page() {
  const user = await currentUser()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Perfil</h3>
        <p className="text-sm text-muted-foreground">
          É assim que os outros verão você no site
        </p>
      </div>

      <Separator />

      <ProfileForm initialData={user.person} />
    </div>
  )
}
