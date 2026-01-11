"use client";

import { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";


export default function AppHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [logoutActive, setLogoutActive] = useState(false);
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setLogoutActive(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b bg-white relative">
      <h1 className="text-xl font-semibold">Employee Management</h1>

      <div className="relative" ref={dropdownRef}>
        <CgProfile
          className="h-6 w-6 text-gray-600 cursor-pointer"
          onClick={() => setOpen(!open)}
        />

        {open && (
          <Card className="absolute right-0 mt-2 w-56 border border-gray-200 shadow-md z-30 rounded-lg">
            <CardContent className="p-4">
              <p className="text-sm font-bold mb-2 text-gray-800">Profile</p>

              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium text-gray-800">Name: </span>
                {session?.user?.name}
              </p>

              <p className="text-sm text-gray-700 mb-3">
                <span className="font-medium text-gray-800">Role: </span>
                {session?.user?.role}
              </p>

              <div className="flex gap-2 justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    router.push("/profile");
                  }}
                  className="flex items-center gap-1 px-3"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>

                <Button
                  variant={logoutActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setLogoutActive(true);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className={`flex items-center gap-1 px-3 ${
                    logoutActive
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  <LogOut
                    className={`h-4 w-4 ${
                      logoutActive ? "text-white" : "text-black"
                    }`}
                  />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </header>
  );
}
