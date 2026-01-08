import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/employees/add")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (
      token.department.toLowerCase() !== "admin"
    ) {
      return NextResponse.redirect(new URL("/employees", req.url));
    }
  }


    if (pathname.startsWith("/employees/edit")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (
      token.department.toLowerCase() !== "humanresources" && token.department.toLowerCase() !== "admin"
    ) {
      return NextResponse.redirect(new URL("/employees", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/employees/add"],
};
