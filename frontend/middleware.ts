import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { APP_ROUTES } from './constants/app-routes'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value
  const {pathname} = request.nextUrl
  const isAuthRoute = pathname.startsWith('/auth')

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)'],
}
