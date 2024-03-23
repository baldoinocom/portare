import { action as ac } from '@/actions'
import { PermissionGroupCode } from '@/permissions'
import { ActionState } from './safe-action'

export const shieldAction = <TInput, TOutput>({
  action,
  permission,
  overwriter,
}: {
  action: (data: TInput) => Promise<ActionState<TInput, TOutput>>
  permission?: PermissionGroupCode
  overwriter?: PermissionGroupCode | null
}) => {
  if ((!permission && !overwriter) || overwriter === null) return action

  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const { data: check } = await ac
      .permission()
      .check({ permission: String(overwriter || permission), guard: 'action' })

    if (!check) {
      return { error: 'Usuário não tem permissão para realizar esta ação' }
    }

    return action(data)
  }
}

export const shieldPartialAction = <TInput, TOutput>({
  action,
  permission,
  overwriter,
}: {
  action: (data?: TInput) => Promise<ActionState<TInput, TOutput>>
  permission?: PermissionGroupCode
  overwriter?: PermissionGroupCode | null
}) => {
  return shieldAction({ action, permission, overwriter }) as (
    data?: TInput,
  ) => Promise<ActionState<TInput, TOutput>>
}
