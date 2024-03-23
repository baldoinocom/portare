import { PermissionGroupCode, checkPermission } from '@/permissions'
import { useShield } from '@/store/use-shield'

type ShieldProps = {
  page?: boolean
  permission: PermissionGroupCode
  children: React.ReactNode
}

export const Shield = ({ page, permission, children }: ShieldProps) => {
  const { permissions } = useShield.getState()

  const guard = page ? 'page' : 'component'

  const check = checkPermission({ permission, guard }, permissions)

  return check ? children : null
}
