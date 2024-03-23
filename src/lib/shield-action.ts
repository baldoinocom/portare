import { action } from '@/actions'
import { PermissionGroupCode } from '@/permissions'
import { ActionState } from './safe-action'

export const shieldAction = <TInput, TOutput>({
  action: actionFunc,
  permission,
  overwriter,
}: {
  action: (data: TInput) => Promise<ActionState<TInput, TOutput>>
  permission?: PermissionGroupCode
  overwriter?: PermissionGroupCode | null
}) => {
  if ((!permission && !overwriter) || overwriter === null) return actionFunc

  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const { data: check } = await action
      .permission()
      .check({ permission: String(overwriter || permission), guard: 'action' })

    if (!check) {
      return { error: 'Usuário não tem permissão para realizar esta ação' }
    }

    return actionFunc(data)
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
