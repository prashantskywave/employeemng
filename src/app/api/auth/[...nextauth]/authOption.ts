import CredentialsProvider from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await Employee.findOne({ email: credentials.email });
        if (!user) return null;

        if (user.password !== credentials.password) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          status: user.status,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if ((user as any).status !== "Active") {
        return false;
      }
      return true;
    },
  },

  pages: {
    signIn: "/",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
