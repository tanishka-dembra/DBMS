import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { backendApiBaseUrl } from "@/lib/api";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret",
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        loginType: { label: "Login type", type: "text" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        if (!email) {
          return null;
        }

        const password = (credentials?.password ?? "").trim();
        if (!password) {
          return null;
        }

        const backendResponse = await fetch(`${backendApiBaseUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ email, password })
        }).catch(() => null);

        if (backendResponse?.ok) {
          const payload = await backendResponse.json();
          const user = payload.user;

          if (credentials?.loginType === "admin" && user.role !== "admin") {
            return null;
          }

          return {
            id: String(user.user_id),
            name: user.name,
            email: user.email,
            companyName: user.company?.company_name,
            role: user.role,
            apiToken: payload.token
          };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.designation = user.designation;
        token.companyName = user.companyName;
        token.role = user.role;
        token.apiToken = user.apiToken;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      session.user.designation = token.designation as string | undefined;
      session.user.companyName = token.companyName as string | undefined;
      session.user.role = token.role;
      session.user.apiToken = token.apiToken;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};
