import { action } from '@/actions'
import { PermissionGroupCode, PermissionOverwriter } from '@/permissions'
import { ActionState } from './safe-action'

export const shieldAction = <TInput, TOutput>({
  action: actionFuc,
  permission,
  overwriter,
}: {
  action: (data: TInput) => Promise<ActionState<TInput, TOutput>>
  permission?: PermissionGroupCode
  overwriter?: PermissionOverwriter
}) => {
  if ((!permission && !overwriter) || overwriter === null) return actionFuc

  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const check = await action.permission().checkUser({
      permission: overwriter?.length ? overwriter : permission,
      guard: 'action',
    })

    if (!check) {
      return { error: 'Usuário não tem permissão para realizar esta ação' }
    }

    return actionFuc(data)
  }
}

export const shieldPartialAction = <TInput, TOutput>({
  action,
  permission,
  overwriter,
}: {
  action: (data?: TInput) => Promise<ActionState<TInput, TOutput>>
  permission?: PermissionGroupCode
  overwriter?: PermissionOverwriter
}) => {
  return shieldAction({ action, permission, overwriter }) as (
    data?: TInput,
  ) => Promise<ActionState<TInput, TOutput>>
}
