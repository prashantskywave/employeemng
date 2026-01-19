"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChangePassword from "./change-password";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 space-y-2">
            <p>
              <span className="font-medium">EMPID:</span>{" "}
              {session?.user?.employeeId || "—"}
            </p>
            <p>
              <span className="font-medium">Name:</span>{" "}
              {session?.user?.firstName || session?.user?.lastName
                ? `${session?.user?.firstName} ${session?.user?.lastName}`
                : "—"}
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
              <span
                className={
                  session?.user?.status?.toLowerCase() === "active"
                    ? "text-green-600 font-semibold"
                    : "text-gray-600"
                }
              >
                {session?.user?.status || "—"}
              </span>
            </p>

          </div>

          <div className="flex justify-center md:justify-center py-10 px-10">
            {session?.user?.profileImage ? (
              <img
                src={
                  session.user.profileImage.startsWith("http")
                    ? session.user.profileImage
                    : `${window.location.origin}/${session.user.profileImage}`
                }
                alt="Profile"
                className="h-28 w-28 rounded-full object-cover border"
              />
            ) : (
              <div className="h-28 w-28 rounded-full border flex items-center justify-center text-sm text-gray-400">
                No Image
              </div>
            )}
          </div>
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
