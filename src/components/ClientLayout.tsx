"use client";

import { usePathname } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // 🔐 LOGIN PAGE → NO SIDEBAR / HEADER
  if (isLoginPage) {
    return <>{children}</>;
  }

  // 🧭 OTHER PAGES → SIDEBAR + HEADER
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden min-w-[1280px]">
        {/* SIDEBAR */}
        <AppSidebar />

        {/* RIGHT CONTENT */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <AppHeader />

          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
