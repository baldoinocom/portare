import { db } from '@/lib/db'
import { ActionState } from '@/lib/safe-action'
import { extractPermission, PermissionGroupCode } from '@/permissions'
import { currentUser } from '@clerk/nextjs'

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
    const { group, code } = extractPermission(
      (overwriter || permission) as PermissionGroupCode,
    )

    let check

    const user = await currentUser()

    if (user) {
      check = await db.user.findUnique({
        where: {
          id: user.id,
          groups: {
            some: {
              roles: {
                some: {
                  permissions: { some: { group, code, guard: 'action' } },
                },
              },
            },
          },
        },
      })
    }

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
