"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChangePassword from "./change-password";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logoutActive, setLogoutActive] = useState(false);

  if (status === "loading") {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Profile</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              variant={logoutActive ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setLogoutActive(true);
                signOut({ callbackUrl: "/login" });
              }}
              className={`flex items-center gap-1 px-3 ${logoutActive
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-100"
                }`}
            >
              <LogOut
                className={`h-4 w-4 ${logoutActive ? "text-white" : "text-black"
                  }`}
              />
              Logout
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            <span className="font-medium">EMPID:</span>{" "}
            {session?.user?.employeeId || "—"}
          </p>
          <p>
            <span className="font-medium">Name:</span>{" "}
            {session?.user?.name || "—"}
          </p>
          <p>
            <span className="font-medium">Email:</span>{" "}
            {session?.user?.email || "—"}
          </p>
          <p>
            <span className="font-medium">Contact:</span>{" "}
            {session?.user?.contact || "—"}
          </p>
          <p>
            <span className="font-medium">Department:</span>{" "}
            {session?.user?.department || "—"}
          </p>
          <p>
            <span className="font-medium">Role:</span>{" "}
            {session?.user?.role || "—"}
          </p>
          <p>
            <span className="font-medium">Joining Date:</span>{" "}
            {session?.user?.joiningDate || "—"}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            {session?.user?.status || "—"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePassword />
        </CardContent>
      </Card>
    </div>
  );
}
