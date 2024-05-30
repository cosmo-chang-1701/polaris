import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isPuclicPage =
        nextUrl.pathname.startsWith('/login') ||
        nextUrl.pathname.startsWith('/signup')
      if (isPuclicPage) {
        if (isLoggedIn) return Response.redirect(new URL('/workspace', nextUrl))
        return true
      } else {
        if (isLoggedIn) return true
        return false
      }
    }
  },
  providers: []
} satisfies NextAuthConfig
