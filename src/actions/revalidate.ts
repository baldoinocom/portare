'use server'

import { revalidatePath } from 'next/cache'

export const revalidateAction = async () => {
  revalidatePath('/')
}
