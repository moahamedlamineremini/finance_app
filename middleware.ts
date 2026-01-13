import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Logique supplémentaire si nécessaire
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Configuration : protéger les routes spécifiques
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/transactions/:path*',
  ]
}
