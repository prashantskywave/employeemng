import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { canAccessAddEmployee, canAccessEditEmployee } from "./lib/permission";
export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = req.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const department = token.department as string | undefined;

  if (pathname.startsWith("/employees/add")) {
    if (!canAccessAddEmployee(department)) {
      return NextResponse.redirect(new URL("/employees", req.url));
    }
  }

  if (pathname.startsWith("/employees/edit")) {
    if (!canAccessEditEmployee(department)) {
      return NextResponse.redirect(new URL("/employees", req.url));
    }
  }
}
export const config = {
  matcher: [
    "/employees/add",
    "/employees/edit/:path*",
    "/employees/profile/:path*",
    "/profile/:path*", 
    "/employees/:path*",
    "/departments/:path*",
     "/roles/:path*"
  ],
};

