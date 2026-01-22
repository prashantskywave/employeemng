import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "role" },
      },


      async authorize(credentials) {
        await connectDB();

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Email or Password");
        }

        const user = await Employee.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Email not Found!");
        }

        const status = user.status?.toLowerCase().trim();
        if (status !== "active") {
          throw new Error("USER_INACTIVE");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password.trim(),
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Password is Incorrect");
        }
        // const [firstName, ...rest] = user.name.split(" ");
        // const lastName = rest.join(" ");

        return {
          id: user._id.toString(),
          employeeId: user.employeeId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          contact: user.contact,
          role: user.role,
          department: user.department,
          joiningDate: user.joiningDate?.toISOString(),
          status: user.status,
          image: user.profileImage || "",
        };
      }
    }),
  ],

  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.profileImage = (user as any).image;
        token.employeeId = user.employeeId;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = (user as any).role;
        token.department = (user as any).department;
        token.contact = user.contact;
        token.joiningDate = user.joiningDate;
        token.status = user.status;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.employeeId = token.employeeId as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as string;
        session.user.department = token.department as string;
        session.user.contact = token.contact as string;
        session.user.joiningDate = token.joiningDate as string;
        session.user.status = token.status as string;
        session.user.profileImage = token.profileImage;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",

  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
