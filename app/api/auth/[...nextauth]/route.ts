import GoogleProvider from "next-auth/providers/google";
import NextAuth, { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.JWT_SECRET!,
};

const auth = NextAuth(authOptions);
export { auth as GET, auth as POST };
