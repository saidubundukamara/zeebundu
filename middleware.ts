import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Admin routes are handled separately, this middleware only handles public routes
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Since admin routes are excluded from matcher, this only handles public routes
        // Allow all public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - admin (admin routes use separate auth)
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!admin|api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}