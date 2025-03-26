import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add your own logic here for validating credentials
        // This is just an example
        if (
          credentials?.email === "user@example.com" &&
          credentials?.password === "password"
        ) {
          return {
            id: "1",
            name: "Demo User",
            email: "user@example.com",
          };
        }
        return null;
      },
    }),
  ],
  secret:
    process.env.NEXTAUTH_SECRET ||
    "your-fallback-secret-should-be-in-env-in-production",
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // TODO: Handle jwt population later
  },
};

// Create handlers for NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
