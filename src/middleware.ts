import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ['/api/webhooks(.*)'],
  apiRoutes: ['/api/(.*)'],
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
