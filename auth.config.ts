import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login"
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnWorkspace = nextUrl.pathname.startsWith("/workspace");
      if (isOnWorkspace) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/workspace", nextUrl));
      }
      return true;
    }
  },
  providers: [] // Add providers with an empty array for now
} satisfies NextAuthConfig;
