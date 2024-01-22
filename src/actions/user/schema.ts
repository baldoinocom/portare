import { z } from 'zod'

export const UserIdSchema = z.object({
  id: z.string().cuid(),
})

export const UserSchema = z.object({
  username: z.string(),
})

export const UserUpdateSchema = UserIdSchema.merge(UserSchema.deepPartial())

export const UserPasswordFormSchema = z
  .object({
    externalUserId: z.string({ required_error: 'O usuário é obrigatório' }),

    currentPassword: z
      .string({ required_error: 'A senha atual é obrigatória' })
      .min(4, { message: 'A senha atual deve ter no mínimo 4 caracteres' }),

    newPassword: z
      .string({ required_error: 'A nova senha é obrigatória' })
      .min(4, { message: 'A nova senha deve ter no mínimo 4 caracteres' }),

    passwordConfirmation: z
      .string({ required_error: 'A senha de confirmação é obrigatória' })
      .min(4, {
        message: 'A senha de confirmação deve ter no mínimo 4 caracteres',
      }),
  })
  .refine(
    ({ newPassword, passwordConfirmation }) =>
      newPassword === passwordConfirmation,
    {
      path: ['passwordConfirmation'],
      message: 'A senha de confirmação deve ser igual a nova senha',
    },
  )
