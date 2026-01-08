
"use client";

import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function AppHeader() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b bg-white relative">
      <h1 className="text-xl font-semibold">Employee Management</h1>

      <div className="relative">
        <CgProfile
          className="h-6 w-6 text-gray-600 cursor-pointer"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <div className="absolute right-0 mt-2 w-56 bg-white border rounded-md shadow-md p-3">
            <p className="text-sm font-semibold mb-2 text-gray-800">
               Profile
            </p>

            <p className="text-sm font-medium text-gray-700">
              {session?.user?.name}
            </p>

            <p className="text-xs text-gray-500 mb-3">
              {session?.user?.role}
          
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-2 w-full"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
