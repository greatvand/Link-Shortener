import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isDashboardRoute = createRouteMatcher(['/dashboard(.*)'])
const isHomeRoute = createRouteMatcher(['/'])

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard routes — redirect to sign-in if not authenticated
  if (isDashboardRoute(req)) {
    await auth.protect()
  }

  // Redirect signed-in users from homepage to dashboard
  if (isHomeRoute(req)) {
    const { userId } = await auth()
    if (userId) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
