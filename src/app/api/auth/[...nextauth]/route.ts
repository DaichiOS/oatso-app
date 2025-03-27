import { users } from "@/app/api/register/route";
import bcrypt from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/*
The flow of NextAuth is as follows:
1. User signs in with credentials
2. Your authorize function validates them and returns a user object
3. JWT callback runs with that user object, creating a token with user data
4. When a component calls useSession(), the session callback runs
5. Session callback transfers data from token to session object
6. Your component gets the session with user data
*/

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Find the user in our "database"
        console.log("Credentials received:", credentials);
        console.log("Current users array:", users);

        // Hardcoded test user for debugging
        if (
          credentials?.email === "test@example.com" &&
          credentials?.password === "password123"
        ) {
          return {
            id: "test-123",
            name: "Test User",
            email: "test@example.com",
          };
        }

        const user = users.find((user) => user.email === credentials?.email);
        // Check if user exists and password is correct
        if (
          user &&
          (await bcrypt.compare(credentials?.password || "", user.password))
        ) {
          // Return the user without the password
          return {
            id: user.id,
            name: user.name,
            email: user.email,
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
    maxAge: 60, // 24 hours in seconds
  },
  cookies: {
    sessionToken: {
      // Configuring the specific cookie that holds the JWT
      name: `authjs.session-token`, // The name of the cookie in the browser
      options: {
        // Standard HTTP cookie options
        httpOnly: true, // Cannot be accessed by JavaScript (security)
        sameSite:
          "lax" /* Cookie is sent when users navigate to your site (clicking a link) 
        but not for cross-site requests (like API calls from other domains) */,

        path: "/", // Cookie is available for all paths on your domain
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        maxAge: 60, // 24 hours in seconds - cookie expiration
      },
    },
  },
  callbacks: {
    /* JWT Callback runs everytime a JWT is created or updated
    First creation happens when a user signs in (registration creates a db entry only)
    Updates happen whenever a user is updated (e.g. profile update)
    */
    jwt: async ({ token, user }) => {
      /* Add user data to the token on initial sign-in
      This ensures we only add this data when the token is first created
      Without this check, we might overwrite our token data with undefined values
      On subsequent calls (token refreshes), user will be undefined
      */
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    /*
    Runs whenever the session is accessed (like when calling useSession() in a component)
    Takes data from the JWT token and adds it to the session object
    */
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.userId as string;
      }
      return session;
    },
  },
};

// Create handlers for NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
