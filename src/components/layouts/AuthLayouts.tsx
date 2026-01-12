"use client";

import { ReactNode } from "react";
import HeaderWrapper from "../HeaderWrapper"; 
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderWrapper />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
