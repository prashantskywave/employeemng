import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      employeeId?: string | null;
      name?: string | null;
      email?: string | null;
      contact?: string | null;
      role?: string | null;
      department?: string | null;
      joiningDate?: string | null;
      status?: string | null;
    };
  }

  interface User {
    employeeId?: string | null;
    contact?: string | null;
    joiningDate?: string | null;
    status?: string | null;
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
