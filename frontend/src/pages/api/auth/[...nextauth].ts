import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });
          
          if (!res.ok) {
            return null;
          }
          
          const data = await res.json();
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
            accessToken: data.token // Store the JWT token
          };
        } catch {
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "google") {
        token.idToken = account.id_token;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.provider = "google";
      }
      
      if (account?.provider === "credentials" && user) {
        token.userId = user.id;
        token.provider = "credentials";
        // Store the JWT from backend for API calls
        token.idToken = (user as typeof user & { accessToken?: string }).accessToken;
      }
      
      // For Google tokens, check expiration and refresh
      if (token.provider === "google" && token.expiresAt) {
        if (Date.now() < (token.expiresAt as number) * 1000 - 60000) {
          return token;
        }
        
        try {
          const response = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID ?? "",
              client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
              grant_type: "refresh_token",
              refresh_token: token.refreshToken as string
            })
          });
          
          const tokens = await response.json();
          
          if (!response.ok) throw tokens;
          
          return {
            ...token,
            idToken: tokens.id_token,
            accessToken: tokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in)
          };
        } catch (error) {
          console.error("Error refreshing token", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token?.idToken) {
        (session as typeof session & { idToken?: string }).idToken = token.idToken as string;
      }
      if (token?.userId) {
        (session as typeof session & { userId?: string }).userId = token.userId as string;
      }
      if (token?.provider) {
        (session as typeof session & { provider?: string }).provider = token.provider as string;
      }
      if (token?.error) {
        (session as typeof session & { error?: string }).error = token.error as string;
      }
      return session;
    }
  }
});
