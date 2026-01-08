
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      role?: string | null;
      department?: string | null;
    };
  }

  interface User {
    role?: string | null;
    department?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
    department?: string | null;
  }
}
