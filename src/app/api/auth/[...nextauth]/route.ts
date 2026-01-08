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
                    throw new Error("INVALID_CREDENTIALS");
                }

                const user = await Employee.findOne({ email: credentials.email });
                if (!user) {
                    throw new Error("INVALID_CREDENTIALS");
                }


                if (
                    user.status !== "Active" ||
                    !["super_admin", "admin"].includes(user.role)
                ) {
                    throw new Error("USER_INACTIVE");
                }

                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password.trim(),
                    user.password
                );

                if (!isPasswordCorrect) {
                    throw new Error("INVALID_CREDENTIALS");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
        error: "/login",

    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
