import { PermissionGroupCode } from '@/actions/permissions'
import { ActionState } from './safe-action'

export const shieldAction = <TInput, TOutput>(
  action: (data: TInput) => Promise<ActionState<TInput, TOutput>>,
  permission: PermissionGroupCode,
) => {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    console.log('permission', permission)

    // if (true) {
    //   return { error: 'Usuário não tem permissão para realizar essa ação' }
    // }

    return action(data)
  }
}
