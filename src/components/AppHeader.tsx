"use client";

import { useState, useRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return "";
  const fullName = `${firstName ?? ""} ${lastName ?? ""}`;
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .join("")
    .slice(0, 2);
};

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
    <header className="h-16 flex items-center justify-between px-6 border-b bg-white">
      <div className="px-6">
        <h1 className="text-lg font-semibold">Employee Management</h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <div
          className="w-9 h-9 rounded-full overflow-hidden"
          onClick={() => setOpen(!open)}
        >
          {session?.user?.profileImage ? (
            <img
              src={session.user.profileImage}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : session?.user?.firstName || session?.user?.lastName ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700 font-bold text-xs">
              {getInitials(session.user.firstName, session.user.lastName)}
            </div>
          ) : (
            <CgProfile className="h-6 w-6 text-gray-600 m-auto" />
          )}
        </div>

        {open && (
          <Card className="absolute right-0 mt-2 w-56 border border-gray-200 shadow-md z-30 rounded-lg">
            <CardContent className="p-4">
              <p className="text-sm font-bold mb-2 text-gray-800">Profile</p>

              <p className="text-sm text-gray-700 mb-1">
                <span className="font-medium text-gray-800">Name: </span>
                {session?.user?.firstName || session?.user?.lastName
                  ? `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""
                  }`
                  : "—"}
              </p>

              <p className="text-sm text-gray-700 mb-3">
                <span className="font-medium text-gray-800">Role: </span>
                {session?.user?.role || "—"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </header>
  );
}
