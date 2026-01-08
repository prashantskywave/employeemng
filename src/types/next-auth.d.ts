// import NextAuth from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id?: string;
//       name?: string | null;
//       email?: string | null;
//       department?: string | null;
//     };
//   }

//   interface User {
//     department?: string | null;
//   }
// }

// declare module "next-auth/jwt" {
//   interface JWT {
//     department?: string | null;
//   }
// }
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
      department?: string;
    };
  }

  interface User {
    role?: string;
    department?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    department?: string;
  }
}
