import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { APP_ROUTES } from './constants/app-routes'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL(APP_ROUTES.LOGIN, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
