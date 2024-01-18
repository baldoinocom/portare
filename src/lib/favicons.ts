import { Icons } from 'next/dist/lib/metadata/types/metadata-types'

export const favicons: Icons = {
  icon: [
    { url: '/favicon.png', media: '(prefers-color-scheme: light)' },
    { url: '/favicon-dark.png', media: '(prefers-color-scheme: dark)' },
  ],
}
